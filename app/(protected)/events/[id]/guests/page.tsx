'use client';

import {
  Tabs, Tab, TextField, Table, TableHead, TableBody, TableRow,
  TableCell, Chip, Paper, Box, TableContainer, Stack, Menu, MenuItem, Select, InputLabel, FormControl,
  TablePagination
} from '@mui/material';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Button from '@/components/Button';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: '12px',
  borderWidth: '1px',
  borderStyle: 'solid',
  backgroundColor: 'transparent',
  fontWeight: 500,
  '&.Sent': {
    borderColor: '#4CAF50', color: '#4CAF50',
  },
  '&.Pending': {
    borderColor: '#FF9800', color: '#FF9800',
  },
  '&.Failed': {
    borderColor: '#F44336', color: '#F44336',
  },
  '&.New': {
    borderColor: '#9C27B0', color: '#9C27B0',
  },
  '&.By\\ form': {
    borderColor: '#00BCD4', color: '#00BCD4',
  }
}));

type Guest = {
  id: number;
  last_name: string;
  first_name: string;
  email: string;
  phone: string;
  status: 'Sent' | 'Pending' | 'Failed' | 'By form' | 'New';
};

const STATUS_TABS = [
  { label: 'Бүгд', value: 'all' },
  { label: 'Шинээр бүртгэсэн', value: 'New' },
  { label: 'Маягаар бүртгүүлсэн', value: 'By form' },
  { label: 'Урилга илгээгдсэн', value: 'Sent' },
  { label: 'Хүлээгдэж байгаа', value: 'Pending' },
  { label: 'Амжилтгүй болсон', value: 'Failed' }
];

export default function EventGuestsPage() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmGuests, setConfirmGuests] = useState<Guest[]>([]);
  const [confirmPage, setConfirmPage] = useState(1);
  const [confirmMeta, setConfirmMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [confirmSearchQuery, setConfirmSearchQuery] = useState('');
  const [confirmFilter, setConfirmFilter] = useState<'New' | Guest['status']>('New');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  const selectedGuest = guests.find((g) => g.id === selectedGuestId);
  const isDeleteDisabled = selectedGuest?.status === 'Sent' || selectedGuest?.status === 'Pending';

  const fetchGuests = async () => {
    try {
      const url = new URL(`http://localhost:3001/guests`);
      url.searchParams.append('eventId', `${id}`);
      url.searchParams.append('page', `${page}`);
      url.searchParams.append('limit', `${limit}`);
      if (searchQuery.trim()) {
        url.searchParams.append('search', searchQuery.trim());
      }

      const res = await fetch(url.toString(), { credentials: 'include' });
      const result = await res.json();

      if (Array.isArray(result.data)) {
        const data = result.data as Guest[];
        setGuests(data);
        setMeta(result.meta);

        const filtered = statusFilter === 'all'
          ? data
          : data.filter((g) => g.status === statusFilter);

        setFilteredGuests(filtered);
      }
    } catch (error) {
      console.error('Guests fetch error:', error);
    }
  };

  const fetchConfirmGuests = async () => {
    try {
      const url = new URL(`http://localhost:3001/guests`);
      url.searchParams.append('eventId', `${id}`);
      url.searchParams.append('page', `${confirmPage}`);
      url.searchParams.append('limit', `${limit}`);
      url.searchParams.append('status', confirmFilter);
  
      if (confirmSearchQuery.trim()) {
        url.searchParams.append('search', confirmSearchQuery.trim());
      }
  
      const res = await fetch(url.toString(), { credentials: 'include' });
      const result = await res.json();
  
      if (Array.isArray(result.data)) {
        setConfirmGuests(result.data);
        setConfirmMeta(result.meta);
      }
    } catch (error) {
      console.error('Confirm Guests fetch error:', error);
    }
  };
  
  useEffect(() => {
    if (id) fetchGuests();
  }, [id, page, statusFilter, searchQuery]);

  useEffect(() => {
    if (openConfirm && id) {
      fetchConfirmGuests();
    }
  }, [openConfirm, id, confirmPage, confirmSearchQuery, confirmFilter]); 
  

  const handleAddGuest = async () => {
    const res = await fetch('http://localhost:3001/guests', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, eventId: Number(id) }),
    });

    if (res.ok) {
      setPage(1);
      setStatusFilter('all');
      setSearchQuery('');
      await fetchGuests();
      setOpenAdd(false);
      setForm({ first_name: '', last_name: '', email: '', phone: '' });
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, guestId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedGuestId(guestId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGuestId(null);
  };
  
  const handleDeleteGuest = async () => {
    if (!selectedGuestId) return;
  
    await fetch(`http://localhost:3001/guests/${selectedGuestId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  
    await fetchGuests(); 
  };  

  const handleSendInvites = () => {
    const toInvite = guests.filter((g) => !['Sent', 'Pending'].includes(g.status));
    console.log('Илгээх зочид:', toInvite);
    setOpenConfirm(false);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="ghost" onClick={() => setOpenConfirm(true)}>
          Урилга илгээх
        </Button>
        <Button onClick={() => setOpenAdd(true)}>
          Зочин бүртгэх +
        </Button>
      </Box>

      <Tabs
        value={statusFilter}
        onChange={(_, newValue) => { setPage(1); setStatusFilter(newValue); }}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{ mb: 2 }}
      >
        {STATUS_TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Хайх..."
          value={searchQuery}
          onChange={(e) => { setPage(1); setSearchQuery(e.target.value); }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Овог</TableCell>
              <TableCell>Нэр</TableCell>
              <TableCell>Имэйл</TableCell>
              <TableCell>Утас</TableCell>
              <TableCell>Төлөв</TableCell>
              <TableCell align="right">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>{guest.last_name}</TableCell>
                <TableCell>{guest.first_name}</TableCell>
                <TableCell>{guest.email}</TableCell>
                <TableCell>{guest.phone}</TableCell>
                <TableCell>
                  <StatusChip label={guest.status} size="small" className={guest.status.replace(' ', '')} />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, guest.id)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={meta.total}
          page={page - 1}
          onPageChange={(_, newPage) => setPage(newPage + 1)}
          rowsPerPage={limit}
          onRowsPerPageChange={() => {}}
          rowsPerPageOptions={[limit]}
        />
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleDeleteGuest} disabled={isDeleteDisabled}>
          Устгах
        </MenuItem>
      </Menu>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-bold mb-4">Урилга илгээх зочдын жагсаалт</DialogTitle>

            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel>Зочдын төлөв</InputLabel>
              <Select
                value={confirmFilter}
                label="Зочдын төлөв"
                onChange={(e) => {
                  setConfirmFilter(e.target.value as any);
                }}
              >
                <MenuItem value="New">Шинээр бүртгэсэн</MenuItem>
                <MenuItem value="By form">Маягтаар бүртгүүлсэн</MenuItem>
                <MenuItem value="Failed">Алдаа гарсан</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <TextField
                size="small"
                placeholder="Хайх..."
                value={confirmSearchQuery}
                onChange={(e) => { setPage(1); setConfirmSearchQuery(e.target.value); }}
              />
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Нэр</TableCell>
                    <TableCell>Имэйл</TableCell>
                    <TableCell>Төлөв</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {confirmGuests.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell>{g.first_name} {g.last_name}</TableCell>
                      <TableCell>{g.email}</TableCell>
                      <TableCell>
                        <StatusChip label={g.status} size="small" className={g.status.replace(' ', '')} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {confirmGuests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        Илгээх зочин олдсонгүй
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={confirmMeta.total}
                page={confirmPage - 1}
                onPageChange={(_, newPage) => setConfirmPage(newPage + 1)}
                rowsPerPage={limit}
                onRowsPerPageChange={() => {}}
                rowsPerPageOptions={[limit]}
              />
            </TableContainer>

            <Stack direction="row" spacing={2} justifyContent="end" mt={3}>
              <Button variant="ghost" onClick={() => setOpenConfirm(false)}>Болих</Button>
              <Button onClick={handleSendInvites}>
                Илгээх
              </Button>
            </Stack>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-bold mb-4">Шинэ зочин бүртгэх</DialogTitle>
            <Stack spacing={2}>
              <TextField label="Овог" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              <TextField label="Нэр" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              <TextField label="Имэйл" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <TextField label="Утас" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Button onClick={handleAddGuest}>Хадгалах</Button>
            </Stack>
          </DialogPanel>
        </div>
      </Dialog>
    </Box>
  );
}

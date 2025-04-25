'use client';

import { AttendancePie } from '@/components/AttendancePie';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Typography } from '@mui/material';
import { InboxIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AttendancePage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(4);
  const [attendees, setAttendees] = useState<any[]>([]); 

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await fetch(`/api/guests?eventId=1&status=Sent&page=${page + 1}&limit=${rowsPerPage}`);
        if (response.ok) {
          const data = await response.json();
          setAttendees(data);
        } else {
          console.error('Failed to fetch attendees');
        }
      } catch (error) {
        console.error('Error fetching attendees:', error);
      }
    };

    fetchAttendees();
  }, [page]); 

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const paginated = attendees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 5 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Ирсэн зочдын жагсаалт
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Овог</TableCell>
              <TableCell>Нэр</TableCell>
              <TableCell>Имэйл</TableCell>
              <TableCell>Утас</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="300px"
                  >
                    <InboxIcon size={48} color="#CCCCCC" />
                    <Box sx={{ color: "#CCCCCC", fontSize: '1rem' }}>
                      Хоосон байна
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>{guest.last_name}</TableCell>
                  <TableCell>{guest.first_name}</TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>{guest.phone}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={attendees.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </TableContainer>

      <AttendancePie total={attendees.length} checkedIn={attendees.filter(g => g.checkedIn === true).length} />

    </Box>
  );
}

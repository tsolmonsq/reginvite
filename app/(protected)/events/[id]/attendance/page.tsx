'use client';

import { AttendancePie } from '@/components/AttendancePie';
import apiFetch from '@/lib/api';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Typography, Checkbox } from '@mui/material';
import { InboxIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AttendancePage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(4);
  const [attendees, setAttendees] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // Fetch attendees when the page or rowsPerPage changes
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await apiFetch(`/guests?eventId=1&status=Sent&page=${page + 1}&limit=${rowsPerPage}`);
        if (response.ok) {
          const data = await response.json();
          setAttendees(data);
        } else {
          console.error('Failed to fetch attendees');
        }
      } catch (error) {
        console.error('Error fetching attendees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [page, rowsPerPage]);

  // Handle page change for pagination
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle checkbox change for updating attendance
  const handleCheckboxChange = async (guestId: string, checked: boolean) => {
    try {
      const response = await apiFetch(`/guests/${guestId}/attendance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_attended: checked }), // Send { is_attended: true/false }
      });

      if (response.ok) {
        const updatedGuest = await response.json();
        // Update the local attendees state with the updated attendance status
        setAttendees((prev) => prev.map(guest => guest.id === guestId ? updatedGuest : guest));
      } else {
        console.error('Failed to update attendance');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  // Paginate the attendees based on the current page and rowsPerPage
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
              <TableCell>Ирц</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
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
                  <TableCell sx={{ border: '2px solid #e2e2e2' }}>{guest.email}</TableCell> {/* Styling the email cell */}
                  <TableCell>{guest.phone}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={guest.is_attended || false} // Default to false if no value
                      onChange={(e) => handleCheckboxChange(guest.id, e.target.checked)}
                    />
                  </TableCell>
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

      {/* Pie chart showing attendance stats */}
      <AttendancePie total={attendees.length} checkedIn={attendees.filter(g => g.is_attended).length} />
    </Box>
  );
}

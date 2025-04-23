'use client';

import { AttendancePie } from '@/components/AttendancePie';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography
} from '@mui/material';
import { useState } from 'react';

const allAttendees = [
  { id: 1, last_name: 'Батболд', first_name: 'Цолмон', email: 'tsolmonbatbold88@gmail.com', phone: '99011010' },
  { id: 2, last_name: 'Наранболд', first_name: 'Зул', email: 'jenniesum10@gmail.com', phone: '99011010' }
];

export default function AttendancePage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(4);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const paginated = allAttendees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            {paginated.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>{guest.last_name}</TableCell>
                <TableCell>{guest.first_name}</TableCell>
                <TableCell>{guest.email}</TableCell>
                <TableCell>{guest.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={allAttendees.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </TableContainer>

      <AttendancePie total={4} checkedIn={2} />
    </Box>
  );
}

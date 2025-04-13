'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
} from '@mui/material';

type Guest = {
  id: number;
  last_name: string;
  first_name: string;
  email: string;
  phone: string;
  status: 'Sent' | 'Pending' | 'Failed' | 'By form' | 'New';
};

const dummyGuests: Guest[] = [
  {
    id: 1,
    last_name: 'Бат-Эрдэнэ',
    first_name: 'Тэмүүжин',
    email: 'temuujin@gmail.com',
    phone: '98298902',
    status: 'Sent',
  },
  {
    id: 2,
    last_name: 'Доржсүрэн',
    first_name: 'Энхцэцэг',
    email: 'dorjsuren@gmail.com',
    phone: '88765900',
    status: 'By form',
  },
  {
    id: 3,
    last_name: 'Сүрэнгийн',
    first_name: 'Отгонбат',
    email: 'otgoo@outlook.com',
    phone: '93124004',
    status: 'New',
  },
  {
    id: 4,
    last_name: 'Чулуунбаатар',
    first_name: 'Мөнхтуяа',
    email: 'munhtuya@gmail.com',
    phone: '99003121',
    status: 'Sent',
  },
  {
    id: 5,
    last_name: 'Ганболд',
    first_name: 'Хатанбаатар',
    email: 'khatanaa0903@outlook.com',
    phone: '88102938',
    status: 'Pending',
  },
  {
    id: 6,
    last_name: 'Эрдэнэчимэг',
    first_name: 'Ариунзул',
    email: 'ariu100@gmail.com',
    phone: '99120394',
    status: 'Failed',
  },
];

export default function EventGuestsPage() {
  const { id } = useParams();
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGuests(dummyGuests);
    }, 500);

    return () => clearTimeout(timeout);
  }, [id]);

  const getStatusChipColor = (status: Guest['status']) => {
    switch (status) {
      case 'Sent':
        return { label: 'Sent', color: 'success' };
      case 'Pending':
        return { label: 'Pending', color: 'warning' };
      case 'Failed':
        return { label: 'Failed', color: 'error' };
      case 'By form':
        return { label: 'By form', color: 'info' };
      case 'New':
        return { label: 'New', color: 'primary' };
      default:
        return { label: status, color: 'default' };
    }
  };

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', py: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Урьсан зочид - Эвент #{id}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Овог</TableCell>
              <TableCell>Нэр</TableCell>
              <TableCell>Имэйл</TableCell>
              <TableCell>Утас</TableCell>
              <TableCell>Төлөв</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guests.map((guest) => {
              const statusChip = getStatusChipColor(guest.status);
              return (
                <TableRow key={guest.id} hover>
                  <TableCell>{guest.last_name}</TableCell>
                  <TableCell>{guest.first_name}</TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>{guest.phone}</TableCell>
                  <TableCell>
                    <Chip label={statusChip.label} color={statusChip.color as any} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

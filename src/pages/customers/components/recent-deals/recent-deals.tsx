// import AddIcon from '@mui/icons-material/Add';
// import { Box, Button, CardContent, Container, Typography } from '@mui/material';
// import React, { useCallback, useEffect, useState } from 'react';
// import type { Deal } from '../../types/deal';
// import { mockDeals } from '../../types/deal';
// import './recent-deals.css';
// import { useParams, useRouter } from 'next/navigation';
// import Grid from '@mui/material/Grid';
// import DealFormModal from '@/components/deal-form-modal/deal-form-modal';
// import SelectCustomerModal from '@/components/select-customer-modal/select-customer-modal';
// import { BusinessCenterOutlined } from '@mui/icons-material';

// const RecentDeals = () => {
//   const router = useRouter();
//   const { id: customerId } = useParams();
//   const dealsPerPage = 3;

//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [addNewDealOpen, setAddNewDealOpen] = useState(false);
//   const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

//   const loadDeals = useCallback(() => {
//     if (customerId) {
//       const filtered = mockDeals.filter((deal) => deal.customerId === Number(customerId));
//       setDeals(filtered);
//     }
//   }, [customerId]);

//   useEffect(() => {
//     loadDeals();
//   }, [loadDeals]);

//   const handleDealIdClick = (dealId: number) => {
//     router.push(`/deal/${dealId}`);
//   };

//   const loadMore = () => {
//     setCurrentIndex((prev) => prev + dealsPerPage);
//   };

//   const goBack = () => {
//     setCurrentIndex((prev) => Math.max(0, prev - dealsPerPage));
//   };

//   const visibleDeals = deals.slice(currentIndex, currentIndex + dealsPerPage);
//   const totalPages = Math.ceil(deals.length / dealsPerPage);
//   const currentPage = Math.floor(currentIndex / dealsPerPage) + 1;

//   const renderModal = () => (
//     <>
//       <SelectCustomerModal
//         open={!!isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onCustomerSelected={(customerId) => {
//           setSelectedCustomerId(customerId);
//           setIsModalOpen(false);
//           setAddNewDealOpen(true);
//         }}
//       />
//       {selectedCustomerId && (
//         <DealFormModal
//           open={addNewDealOpen}
//           onClose={() => setAddNewDealOpen(false)}
//           onChangeCustomerRequested={() => {
//             setAddNewDealOpen(false);
//             setIsModalOpen(true);
//           }}
//           customerId={selectedCustomerId}
//         />
//       )}
//     </>
//   );

//   if (!deals || deals.length === 0) {
//     return (
//       <CardContent className="recent-deals-header">
//         <Box className="not-found-recent-deals-log">
//           <BusinessCenterOutlined />
//           <Typography variant="body1" className="text-no-recent-deals-found">
//             No recent deals found.
//           </Typography>
//         </Box>
//       </CardContent>
//     );
//   }

//   return (
//     <Container className="recent-deals-container" color="secondary">
//       <Grid container className="recent-deals-header">
//         <Grid size={{ xs: 10, md: 10.5 }}>
//           <Typography variant="h5" color="secondary">
//             Recent Deals
//           </Typography>
//         </Grid>
//         <Grid size={{ xs: 2, md: 1.5 }}>
//           <Button variant="contained" onClick={() => setIsModalOpen(true)}>
//             <AddIcon className="add-new-deal-button" />
//           </Button>
//         </Grid>
//       </Grid>

//       {visibleDeals.map((deal: Deal) => (
//         <Grid container key={deal.id} onClick={() => handleDealIdClick(deal.id)} className="recent-deals-item">
//           <Grid size={{ xs: 3, sm: 2, md: 2, lg: 2 }}>
//             <Image src={deal.dealPicture} alt="Deal" width={44} height={44} className="deal-image" />
//           </Grid>

//           <Grid size={{ xs: 9, sm: 10, md: 10, lg: 10 }} className="recent-deals-details">
//             <Grid container direction="column">
//               <Grid size={{ xs: 12, md: 12 }}>
//                 <Typography variant="body1" className="recent-deals-address-detail">
//                   {deal.street}, {deal.city}, {deal.state}
//                 </Typography>
//               </Grid>

//               <Grid size={{ xs: 12, md: 12 }} container alignItems="center" gap={1}>
//                 <Typography variant="body2">
//                   {new Date(deal.appointmentDate).toLocaleString('en-US', {
//                     month: 'short',
//                     day: 'numeric',
//                     year: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}
//                 </Typography>
//                 <Typography variant="body2">•</Typography>
//                 <Typography variant="body2">$ {deal.price}</Typography>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       ))}

//       <Box className="pagination-controls">
//         <Button variant="text" onClick={goBack} disabled={currentIndex === 0}>
//           Back
//         </Button>
//         <Typography variant="body2">
//           {currentPage} of {totalPages}
//         </Typography>
//         <Button variant="text" onClick={loadMore} disabled={currentIndex + dealsPerPage >= deals.length}>
//           Load More
//         </Button>
//       </Box>

//       {renderModal()}
//     </Container>
//   );
// };

// export default RecentDeals;

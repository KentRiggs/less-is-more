// import React, { useState } from 'react';
// import { Button, Container, Form } from 'react-bootstrap';

// const HomePage = ({ openEngageModal, openAmendModal }) => {
//   const [apologyText, setApologyText] = useState('');

//   return (
//     <Container className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
//       <h1 style={{ fontFamily: 'Courier New', textAlign: 'center' }}>What are you sorry for?</h1>
//       <Form.Group controlId="apologyText" className="mb-3 w-50">
//         <Form.Control
//           type="text"
//           placeholder="Your apology here..."
//           value={apologyText}
//           onChange={(e) => setApologyText(e.target.value)}
//           style={{ textAlign: 'center' }}
//         />
//       </Form.Group>
//       <div className="d-flex justify-content-between w-50">
//         <Button variant="primary" onClick={openEngageModal}>Open Engage</Button>
//         <Button variant="success">Submit</Button>
//         <Button variant="secondary" onClick={openAmendModal}>Open Amend</Button>
//       </div>
//     </Container>
//   );
// };

// export default HomePage;

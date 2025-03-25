import React from 'react';
import Navigator from './navigation/Navigator';
import { UserProvider } from './contexts/UserContext';

export default function App() {
  return (
    <UserProvider>
      <Navigator />
    </UserProvider>
  );}

import React, { use, useEffect, useRef, useState } from 'react';

import Header from '../components/dashboard/Header';

import Sidebar from '../components/dashboard/Sidebar';

import { Outlet, useOutletContext, useSearchParams } from 'react-router-dom';
import { useCompanyAuth } from '../context/CompanyAuthContext';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { useSocket, useSocketEvent } from '../context/SocketContext';
import { useNotifications } from '../context/NotificationContext';
export type RoleType = "admin" | "company" | "employee"
export interface Roles {
  role: RoleType;

}

const DashboardLayout = () => {

  const [isOpen, setIsOpen] = useState(false)
  const [searchParams,setSearchParams] = useSearchParams()
  const { role } = useOutletContext<Roles>()
  const { company } = useCompanyAuth() as any
  const { user } = useEmployeeAuth()
  const { setRecipient,markAsRead } = useNotifications()
  const { socket, isConnected, emit } = useSocket()
  const isEmployeeRegistered = useRef(false);
  const isCompanyRegistered = useRef(false);

  const isEmployeeJoinedCompanyRoom = useRef(false);
  const isCompanyJoinedCompanyRoom = useRef(false);

  const onToggle = () => {
    setIsOpen(!isOpen)
  }


useEffect(()=>{

  if(user?.id && isConnected && !isEmployeeJoinedCompanyRoom.current && role == 'employee'){
      console.log('Joined EMPLOYEE :',user.id);
      emit('joinCompanyRoom',{ companyId: user.companyId });
      isEmployeeRegistered.current = true;
    }

    if(company?.id && isConnected && !isCompanyJoinedCompanyRoom.current && role == 'company'){
      console.log('jooud COMPANY :',company.id);
      emit('joinCompanyRoom',{ companyId: company.id });
      isCompanyJoinedCompanyRoom.current = true;
    }

},[user?.id, isConnected, emit, socket, company?.id])

  useEffect(() => {
    if (user?.id && isConnected && !isEmployeeRegistered.current && role == 'employee') {
      console.log('online EMPLOYEE :', user.id);
      emit('registerUser', { id: user.id, type: 'EMPLOYEE' });
      isEmployeeRegistered.current = true;
    }
     if (company?.id && isConnected && !isCompanyRegistered.current && role == 'company') {
      console.log('online COMPANY :', company.id);
      emit('registerUser', { id: company.id, type: 'COMPANY' });
      isCompanyRegistered.current = true;
    }
  }, [user?.id, isConnected, emit, socket, company?.id]);


  useEffect(() => {
    switch (role) {
      case 'employee':
        setRecipient(user!.id, 'EMPLOYEE');
        break
      case 'company':
        setRecipient(company!.id, 'COMPANY');
        break
    }
  }, [socket]);


  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar onToggle={onToggle} role={role} isOpen={isOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggle={onToggle} role={role} />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
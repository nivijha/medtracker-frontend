"use client";
import React, { useState } from 'react';
import { Activity, FileText, FlaskRound as Flask, Heart, LayoutDashboard, Menu, PlusCircle, User, X } from 'lucide-react';


const Toggle = ({ defaultChecked = false, onToggle }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onToggle) {
      onToggle(newValue);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`
        relative inline-flex h-6 w-11 cursor-pointer rounded-full
        transition-colors duration-200 ease-in-out
        ${isChecked ? 'bg-green-600' : 'bg-gray-200'}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white
          transition duration-200 ease-in-out
          ${isChecked ? 'translate-x-6' : 'translate-x-0.5'}
          shadow-sm my-0.5
        `}
      />
    </div>
  );
};

function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  return (
    
    <div className="max-h-full bg-gray-50 flex h-screen">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Main Content Area */}
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 pt-2">Manage your account settings and preferences</p>
          </div>

          <div className="card bg-white shadow-sm shadow-slate-300 w-full h-60 flex flex-col p-4 rounded-lg">
            <h1 className="text-black text-2xl font-semibold">Account settings</h1>
            <p className="text-slate-500 text-sm pt-2">Update your personal information and email settings</p>
            <p className='pt-4 font-semibold pb-2'>Email Address</p>
            <input placeholder='user@example.com' className='bg-white shadow-sm shadow-slate-300 rounded-lg h-12 p-2 ' />
            <br />
            <button className='bg-white shadow-sm shadow-slate-300 rounded-lg w-32 py-2 block'>Update Email</button>
          </div>

          <br />

          <div className="card bg-white shadow-sm shadow-white-400 w-full h-71 flex flex-col p-4 rounded-lg">
            <h1 className="text-black text-2xl font-semibold">Notifications</h1>
            <p className="text-slate-500 text-sm pb-5">Configure how you want to receive notifications</p>

              <div className="space-y-0.5 flex">
              <h1 className='w-60'>Email Notifications</h1>
              <div className='flex justify-end w-full'>
                <Toggle 
                  defaultChecked={emailEnabled} 
                  onToggle={setEmailEnabled}
                />
              </div>
            </div>
            <p className="text-sm text-slate-500 text-muted-foreground pb-5">
              Receive email updates about your medical reports
            </p>
            <hr />

            <div className="space-y-0.5 flex">
              <h1 className='pt-5 w-60'>SMS Notifications</h1>
              <div className='flex justify-end w-full pt-5'>
                <Toggle 
                  defaultChecked={smsEnabled} 
                  onToggle={setSmsEnabled}
                />
              </div>
            </div>
            <p className="text-sm text-slate-500 text-muted-foreground">
              Get text messages for important updates
            </p>
          </div>

          <br />
          <div className="card bg-white shadow-sm shadow-white-400 w-full h-60 flex flex-col p-4 rounded-lg">
            <h1 className="text-black text-2xl font-semibold">Language & Region</h1>
            <p className="text-slate-500  text-sm py-4">Choose your preferred language and regional settings</p>

            <div  className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type='radio' value="english" id="english" />
              <p htmlFor="english">English</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type='radio' value="spanish" id="spanish" />
              <p htmlFor="spanish">Spanish</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type='radio' value="french" id="french" />
              <p htmlFor="french">French</p>
            </div>
          </div>
            
          </div>

          <br />
          <div className="card bg-white shadow-sm shadow-white-400 w-full h-70 flex flex-col p-4 rounded-lg pb-16">
            
            <h1 className="text-black text-2xl font-semibold">Privacy & Security</h1>
            <p className="text-black text-sm py-4">Manage your privacy and security preferences</p>
            

            <div className="space-y-0.5 flex">
              <h1 className='w-60'>Two-Factor Authentication</h1>
              <div className='flex justify-end w-full'>
                <button className='bg-white shadow-sm shadow-slate-300 rounded-lg w-32 py-2 block'>Enable</button>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-muted-foreground pb-5">Receive email updates about your medical reports</p>
            <hr className='pb-8'/>

            <div className="space-y-0.5 flex">
              <h1 className='w-60'>Data Sharing</h1>
              <div className='flex justify-end w-full'>
                <button className='bg-white shadow-sm shadow-slate-300 rounded-lg w-32 py-2 block'>Manage</button>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-muted-foreground pb-5">Control how your medical data is shared with healthcare providers</p>
          

          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
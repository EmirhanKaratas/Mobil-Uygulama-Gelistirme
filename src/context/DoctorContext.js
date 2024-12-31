import React, { createContext, useState, useContext } from 'react';

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
    const [doctorName, setDoctorName] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
    const [doctorGender, setDoctorGender] = useState('');

    return (
        <DoctorContext.Provider 
            value={{
                doctorName,
                setDoctorName,
                doctorEmail,
                setDoctorEmail,
                doctorGender,
                setDoctorGender
            }}
        >
            {children}
        </DoctorContext.Provider>
    );
};

export const useDoctor = () => useContext(DoctorContext);

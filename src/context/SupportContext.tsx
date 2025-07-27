import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UnitMember {
  id: string;
  name: string;
  phone: string;
  role: 'head' | 'assistant';
}

export interface Unit {
  id: string;
  name: string;
  description: string;
  members: UnitMember[];
}

interface SupportContextType {
  units: Unit[];
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, unit: Omit<Unit, 'id'>) => void;
  deleteUnit: (id: string) => void;
  addUnitMember: (unitId: string, member: Omit<UnitMember, 'id'>) => void;
  updateUnitMember: (unitId: string, memberId: string, member: Omit<UnitMember, 'id'>) => void;
  deleteUnitMember: (unitId: string, memberId: string) => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};

interface SupportProviderProps {
  children: ReactNode;
}

export const SupportProvider: React.FC<SupportProviderProps> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>([
    {
      id: '1',
      name: 'Welfare Unit',
      description: 'Responsible for member welfare, support, and assistance programs',
      members: [
        { id: '1', name: 'Bro. Abraham', phone: '+2348036347730', role: 'head' },
        { id: '2', name: 'Sis. Juliet', phone: '+2348067352573', role: 'assistant' }
      ]
    },
    {
      id: '2',
      name: 'Accounts Unit',
      description: 'Manages financial records, budgets, and financial reporting',
      members: [
        { id: '3', name: 'Bro. Ojeifo Kenneth', phone: '+2348036299913', role: 'head' },
        { id: '4', name: 'Sis. Christy Osuagwu', phone: '+2347034937183', role: 'assistant' }
      ]
    },
    {
      id: '3',
      name: 'Training Unit',
      description: 'Conducts training programs and skill development for members',
      members: [
        { id: '5', name: 'Bro. John Amara', phone: '+2348036265630', role: 'head' },
        { id: '6', name: 'Sis. Ige', phone: '+2348033155759', role: 'assistant' }
      ]
    },
    {
      id: '4',
      name: 'Secretariat Unit',
      description: 'Handles documentation, records, and administrative duties',
      members: [
        { id: '7', name: 'Bro. Uche Nworie', phone: '+2348037812417', role: 'head' },
        { id: '8', name: 'Sis. Henry', phone: '+2348034361731', role: 'assistant' }
      ]
    },
    {
      id: '5',
      name: 'Prayer Unit',
      description: 'Coordinates prayer activities and spiritual support',
      members: [
        { id: '9', name: 'Bro. Sunday', phone: '+2348149106700', role: 'head' },
        { id: '10', name: 'Sis. Charity', phone: '+2348148283663', role: 'assistant' }
      ]
    },
    {
      id: '6',
      name: 'Visitation Unit',
      description: 'Organizes member visits and outreach programs',
      members: [
        { id: '11', name: 'Bro. Harrison', phone: '+2348033612530', role: 'head' },
        { id: '12', name: 'Sis. Elizabeth', phone: '+2348056581982', role: 'assistant' }
      ]
    },
    {
      id: '7',
      name: 'Uniform Unit',
      description: 'Manages uniform distribution and maintenance',
      members: [
        { id: '13', name: 'Bro. Tony', phone: '+2348036516964', role: 'head' },
        { id: '14', name: 'Sis. Maureen', phone: '+2348064615882', role: 'assistant' }
      ]
    },
    {
      id: '8',
      name: 'Technical Unit',
      description: 'Handles technical support and equipment management',
      members: [
        { id: '15', name: 'Bro. Odion', phone: '+2348104942027', role: 'head' },
        { id: '16', name: 'Sis. Faith', phone: '+2348055839341', role: 'assistant' }
      ]
    }
  ]);

  const addUnit = (unit: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...unit,
      id: Date.now().toString()
    };
    setUnits([...units, newUnit]);
  };

  const updateUnit = (id: string, unit: Omit<Unit, 'id'>) => {
    setUnits(units.map(u => u.id === id ? { ...unit, id, members: u.members } : u));
  };

  const deleteUnit = (id: string) => {
    setUnits(units.filter(u => u.id !== id));
  };

  const addUnitMember = (unitId: string, member: Omit<UnitMember, 'id'>) => {
    const newMember: UnitMember = {
      ...member,
      id: Date.now().toString()
    };
    setUnits(units.map(unit => 
      unit.id === unitId 
        ? { ...unit, members: [...unit.members, newMember] }
        : unit
    ));
  };

  const updateUnitMember = (unitId: string, memberId: string, member: Omit<UnitMember, 'id'>) => {
    setUnits(units.map(unit => 
      unit.id === unitId 
        ? { 
            ...unit, 
            members: unit.members.map(m => 
              m.id === memberId ? { ...member, id: memberId } : m
            )
          }
        : unit
    ));
  };

  const deleteUnitMember = (unitId: string, memberId: string) => {
    setUnits(units.map(unit => 
      unit.id === unitId 
        ? { ...unit, members: unit.members.filter(m => m.id !== memberId) }
        : unit
    ));
  };

  return (
    <SupportContext.Provider value={{
      units,
      addUnit,
      updateUnit,
      deleteUnit,
      addUnitMember,
      updateUnitMember,
      deleteUnitMember
    }}>
      {children}
    </SupportContext.Provider>
  );
};
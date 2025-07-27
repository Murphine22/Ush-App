import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSupport } from '../context/SupportContext';
import { 
  X, 
  Phone, 
  User, 
  Crown, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Shield,
  Users,
  Heart,
  BookOpen,
  Settings,
  Eye,
  Shirt,
  Monitor,
  Mail,
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Calendar,
  Award,
  Zap
} from 'lucide-react';

interface SupportPageProps {
  onClose: () => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onClose }) => {
  const { isAuthenticated } = useAuth();
  const { units, addUnit, updateUnit, deleteUnit, addUnitMember, updateUnitMember, deleteUnitMember } = useSupport();
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [showAddMember, setShowAddMember] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<{ unitId: string; memberId: string } | null>(null);
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);

  const [unitForm, setUnitForm] = useState({ name: '', description: '' });
  const [memberForm, setMemberForm] = useState({ name: '', phone: '', role: 'head' as 'head' | 'assistant' });

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const getUnitIcon = (unitName: string) => {
    const name = unitName.toLowerCase();
    if (name.includes('welfare')) return <Heart className="h-6 w-6 text-pink-500" />;
    if (name.includes('accounts')) return <Settings className="h-6 w-6 text-green-500" />;
    if (name.includes('training')) return <BookOpen className="h-6 w-6 text-blue-500" />;
    if (name.includes('secretariat')) return <Users className="h-6 w-6 text-purple-500" />;
    if (name.includes('prayer')) return <Star className="h-6 w-6 text-yellow-500" />;
    if (name.includes('visitation')) return <Eye className="h-6 w-6 text-indigo-500" />;
    if (name.includes('uniform')) return <Shirt className="h-6 w-6 text-orange-500" />;
    if (name.includes('technical')) return <Monitor className="h-6 w-6 text-cyan-500" />;
    return <Shield className="h-6 w-6 text-gray-500" />;
  };

  const getUnitGradient = (unitName: string) => {
    const name = unitName.toLowerCase();
    if (name.includes('welfare')) return 'from-pink-500 to-rose-500';
    if (name.includes('accounts')) return 'from-green-500 to-emerald-500';
    if (name.includes('training')) return 'from-blue-500 to-indigo-500';
    if (name.includes('secretariat')) return 'from-purple-500 to-violet-500';
    if (name.includes('prayer')) return 'from-yellow-500 to-amber-500';
    if (name.includes('visitation')) return 'from-indigo-500 to-blue-500';
    if (name.includes('uniform')) return 'from-orange-500 to-red-500';
    if (name.includes('technical')) return 'from-cyan-500 to-teal-500';
    return 'from-gray-500 to-slate-500';
  };

  const handleAddUnit = () => {
    if (unitForm.name.trim() && unitForm.description.trim()) {
      addUnit({ ...unitForm, members: [] });
      setUnitForm({ name: '', description: '' });
      setShowAddUnit(false);
    }
  };

  const handleUpdateUnit = () => {
    if (editingUnit && unitForm.name.trim() && unitForm.description.trim()) {
      updateUnit(editingUnit, unitForm);
      setEditingUnit(null);
      setUnitForm({ name: '', description: '' });
    }
  };

  const handleAddMember = (unitId: string) => {
    if (memberForm.name.trim() && memberForm.phone.trim()) {
      addUnitMember(unitId, memberForm);
      setMemberForm({ name: '', phone: '', role: 'head' });
      setShowAddMember(null);
    }
  };

  const handleUpdateMember = () => {
    if (editingMember && memberForm.name.trim() && memberForm.phone.trim()) {
      updateUnitMember(editingMember.unitId, editingMember.memberId, memberForm);
      setEditingMember(null);
      setMemberForm({ name: '', phone: '', role: 'head' });
    }
  };

  const startEditUnit = (unit: any) => {
    setEditingUnit(unit.id);
    setUnitForm({ name: unit.name, description: unit.description });
  };

  const startEditMember = (unitId: string, member: any) => {
    setEditingMember({ unitId, memberId: member.id });
    setMemberForm({ name: member.name, phone: member.phone, role: member.role });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden animate-bounce-in border border-gray-200 dark:border-gray-700">
        {/* Enhanced Header with Floating Elements */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white p-8 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full -ml-16 -mb-16 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-pink-400/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 animate-float">
                <Users className="h-10 w-10 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 animate-slide-in-left">Support & Leadership Team</h1>
                <p className="text-blue-100 text-lg animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                  DIGC Ushering Department Structure
                </p>
                <div className="flex items-center space-x-4 mt-3 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                    <Award className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium">{units.length} Active Units</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                    <Zap className="h-4 w-4 text-green-300" />
                    <span className="text-sm font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 rounded-2xl p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-90 backdrop-blur-sm"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content with Enhanced Scrolling */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)] custom-scrollbar">
          {/* Enhanced Acting Leader Section */}
          <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-amber-900/20 rounded-3xl p-8 mb-10 border-2 border-yellow-200 dark:border-yellow-700 relative overflow-hidden animate-fade-in transform hover:scale-[1.02] transition-all duration-500">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400/20 to-yellow-400/20 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-6 mb-6">
                <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-4 rounded-2xl shadow-xl transform hover:scale-110 transition-all duration-300">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Acting Leader</h2>
                  <p className="text-yellow-700 dark:text-yellow-300 text-lg">Department Head & Coordinator</p>
                </div>
                <div className="ml-auto flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full animate-pulse">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Online</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-bold text-2xl text-gray-900 dark:text-white">Deacon Chinedu</span>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Senior Leadership</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <a 
                    href="tel:+2348037865842"
                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">+234 803 786 5842</span>
                  </a>
                  <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 px-6 py-4 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">DIGC Headquarters</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Role Description:
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                    Oversees all ushering department activities, coordinates with church leadership, 
                    manages department policies, supervises unit heads, and ensures excellence in 
                    hospitality ministry. Responsible for strategic planning, member development, 
                    and maintaining the spiritual and operational standards of the department.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Unit Button (Admin Only) */}
          {isAuthenticated && (
            <div className="mb-8 animate-slide-in-right">
              <button
                onClick={() => setShowAddUnit(true)}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 font-semibold"
              >
                <Plus className="h-6 w-6" />
                <span>Add New Unit</span>
              </button>
            </div>
          )}

          {/* Enhanced Add Unit Form */}
          {showAddUnit && (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl p-8 mb-8 animate-bounce-in border border-gray-200 dark:border-gray-600 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Plus className="h-6 w-6 mr-3 text-blue-600" />
                Add New Unit
              </h3>
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Unit Name"
                    value={unitForm.name}
                    onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })}
                    className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-6 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 text-lg"
                  />
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Unit Description"
                    value={unitForm.description}
                    onChange={(e) => setUnitForm({ ...unitForm, description: e.target.value })}
                    className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-6 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 text-lg"
                    rows={4}
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddUnit}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold shadow-lg"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Unit</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAddUnit(false);
                      setUnitForm({ name: '', description: '' });
                    }}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Unit Form */}
          {editingUnit && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 mb-8 animate-bounce-in border-2 border-blue-200 dark:border-blue-700 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Edit className="h-6 w-6 mr-3 text-blue-600" />
                Edit Unit
              </h3>
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Unit Name"
                  value={unitForm.name}
                  onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-6 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 text-lg"
                />
                <textarea
                  placeholder="Unit Description"
                  value={unitForm.description}
                  onChange={(e) => setUnitForm({ ...unitForm, description: e.target.value })}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-6 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 text-lg"
                  rows={4}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdateUnit}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold shadow-lg"
                  >
                    <Save className="h-5 w-5" />
                    <span>Update Unit</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingUnit(null);
                      setUnitForm({ name: '', description: '' });
                    }}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Units Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {units.map((unit, index) => (
              <div 
                key={unit.id} 
                className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredUnit(unit.id)}
                onMouseLeave={() => setHoveredUnit(null)}
              >
                {/* Enhanced Unit Header */}
                <div 
                  className={`relative p-8 bg-gradient-to-br ${getUnitGradient(unit.name)} text-white cursor-pointer transition-all duration-300 ${hoveredUnit === unit.id ? 'scale-105' : ''}`}
                  onClick={() => toggleUnit(unit.id)}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl transform hover:scale-110 transition-all duration-300">
                          {getUnitIcon(unit.name)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{unit.name}</h3>
                          <p className="text-white/80 text-sm">{unit.members.length} Members</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {isAuthenticated && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditUnit(unit);
                              }}
                              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-300 transform hover:scale-110"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUnit(unit.id);
                              }}
                              className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-xl transition-all duration-300 transform hover:scale-110"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        <button className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-300 transform hover:scale-110">
                          {expandedUnits.includes(unit.id) ? 
                            <ChevronUp className="h-6 w-6" /> : 
                            <ChevronDown className="h-6 w-6" />
                          }
                        </button>
                      </div>
                    </div>
                    <p className="text-white/90 leading-relaxed">{unit.description}</p>
                  </div>
                </div>

                {/* Enhanced Unit Members (Expandable with Animation) */}
                <div className={`transition-all duration-500 ease-in-out ${expandedUnits.includes(unit.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="p-8 animate-fade-in">
                    {isAuthenticated && (
                      <button
                        onClick={() => setShowAddMember(unit.id)}
                        className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold shadow-lg"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Member</span>
                      </button>
                    )}

                    {/* Add Member Form */}
                    {showAddMember === unit.id && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 mb-6 border border-green-200 dark:border-green-700 animate-bounce-in">
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Member Name"
                            value={memberForm.name}
                            onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={memberForm.phone}
                            onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
                          />
                          <select
                            value={memberForm.role}
                            onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value as 'head' | 'assistant' })}
                            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
                          >
                            <option value="head">Unit Head</option>
                            <option value="assistant">Assistant</option>
                          </select>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAddMember(unit.id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 font-semibold"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setShowAddMember(null);
                                setMemberForm({ name: '', phone: '', role: 'head' });
                              }}
                              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Edit Member Form */}
                    {editingMember?.unitId === unit.id && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-6 border-2 border-blue-200 dark:border-blue-700 animate-bounce-in">
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Member Name"
                            value={memberForm.name}
                            onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={memberForm.phone}
                            onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
                          />
                          <select
                            value={memberForm.role}
                            onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value as 'head' | 'assistant' })}
                            className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
                          >
                            <option value="head">Unit Head</option>
                            <option value="assistant">Assistant</option>
                          </select>
                          <div className="flex space-x-3">
                            <button
                              onClick={handleUpdateMember}
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 font-semibold"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => {
                                setEditingMember(null);
                                setMemberForm({ name: '', phone: '', role: 'head' });
                              }}
                              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Members List */}
                    <div className="space-y-4">
                      {unit.members.map((member, memberIndex) => (
                        <div 
                          key={member.id} 
                          className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl p-6 hover:from-gray-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-blue-900/30 transition-all duration-300 transform hover:scale-[1.02] border border-gray-200 dark:border-gray-600 animate-slide-in-left"
                          style={{ animationDelay: `${memberIndex * 0.1}s` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-2xl ${member.role === 'head' ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-gradient-to-br from-blue-400 to-indigo-400'} shadow-lg transform hover:scale-110 transition-all duration-300`}>
                                {member.role === 'head' ? 
                                  <Crown className="h-6 w-6 text-white" /> : 
                                  <UserCheck className="h-6 w-6 text-white" />
                                }
                              </div>
                              <div>
                                <p className="font-bold text-xl text-gray-900 dark:text-white">{member.name}</p>
                                <div className="flex items-center space-x-2">
                                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${member.role === 'head' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                    {member.role === 'head' ? 'Unit Head' : 'Assistant'}
                                  </span>
                                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-medium">Available</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <a 
                                href={`tel:${member.phone}`}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-semibold shadow-lg"
                              >
                                <Phone className="h-4 w-4" />
                                <span>{member.phone}</span>
                              </a>
                              <a 
                                href={`sms:${member.phone}`}
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                                title="Send SMS"
                              >
                                <MessageCircle className="h-5 w-5" />
                              </a>
                              {isAuthenticated && (
                                <>
                                  <button
                                    onClick={() => startEditMember(unit.id, member)}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => deleteUnitMember(unit.id, member.id)}
                                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Contact Information */}
          <div className="mt-12 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <Mail className="h-7 w-7 mr-3 text-blue-600" />
              General Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Emergency Line</p>
                    <a href="tel:+2348037812417" className="text-lg font-bold text-gray-900 dark:text-white hover:text-green-600 transition-colors">
                      +234 8037812417
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Email</p>
                    <a href="mailto:digcusheringdepartment@gmail.com" className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                      digcusheringdepartment@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Location</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Dunamis HQ, Abuja</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-violet-500 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Availability</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">24/7 Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
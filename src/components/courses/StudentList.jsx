import React from 'react';
import { Edit2, Trash2, Mail, Phone, Eye, User, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { formatDate } from '../../utils/helpers';

export function StudentList({ students, onEdit, onDelete, onView }) {
  if (students.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-full mb-6">
            <GraduationCap className="w-16 h-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Students Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md text-center">
            Get started by adding your first student. You can manage their profiles, enrollments, and track their progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid View for better visual appeal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            {/* Student Header */}
            <div className="flex items-center space-x-4 mb-4">
              {student.profileImage ? (
                <img
                  src={student.profileImage}
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover border-3 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center border-3 border-gray-200 dark:border-gray-600">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{student.name}</h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    {student.dateOfBirth ? 
                      `${new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} years old` : 
                      'Age not provided'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail size={14} className="mr-2 text-blue-500 dark:text-blue-400" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone size={14} className="mr-2 text-green-500 dark:text-green-400" />
                <span>{student.phone}</span>
              </div>
              {student.currentOccupation && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <GraduationCap size={14} className="mr-2 text-purple-500 dark:text-purple-400" />
                  <span className="truncate">{student.currentOccupation}</span>
                </div>
              )}
              {(student.city || student.state) && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={14} className="mr-2 text-red-500 dark:text-red-400" />
                  <span className="truncate">
                    {[student.city, student.state].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Education Badge */}
            {student.educationLevel && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  <GraduationCap size={12} className="mr-1" />
                  {student.educationLevel.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            )}

            {/* Emergency Contact */}
            {student.emergencyContactName && (
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Emergency Contact</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{student.emergencyContactName}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{student.emergencyContactPhone}</p>
              </div>
            )}

            {/* Joined Date */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Joined {formatDate(student.createdAt)}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4 border-t border-gray-100 dark:border-gray-600">
              <button
                onClick={() => onView(student)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
              >
                <Eye size={14} />
                <span>View</span>
              </button>
              <button
                onClick={() => onEdit(student)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors"
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(student.id)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table View (Alternative - can be toggled) */}
      <div className="hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Emergency Contact</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {student.profileImage ? (
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{student.dateOfBirth}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail size={14} className="mr-1" />
                      {student.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={14} className="mr-1" />
                      {student.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900 dark:text-white">{student.emergencyContactName}</p>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={14} className="mr-1" />
                      {student.emergencyContactPhone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(student.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(student)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
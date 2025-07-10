import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import ImageWithFallback from '../../components/ui/ImageWithFallback';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiSearch, FiGrid, FiList, FiTrash2, FiDownload, FiImage, FiVideo, FiFile } = FiIcons;

const AdminMedia = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const mediaFiles = [
    {
      id: '1',
      name: 'avocado-toast.jpg',
      type: 'image',
      size: '2.3 MB',
      url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      uploadDate: '2024-01-15',
      usedIn: ['5-Minute Avocado Toast'],
    },
    {
      id: '2',
      name: 'stir-fry.jpg',
      type: 'image',
      size: '1.8 MB',
      url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      uploadDate: '2024-01-14',
      usedIn: ['Quick Chicken Stir-Fry'],
    },
    {
      id: '3',
      name: 'overnight-oats.jpg',
      type: 'image',
      size: '1.5 MB',
      url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      uploadDate: '2024-01-13',
      usedIn: ['Overnight Oats'],
    },
    {
      id: '4',
      name: 'cooking-video.mp4',
      type: 'video',
      size: '15.2 MB',
      url: '/placeholder-video.mp4',
      uploadDate: '2024-01-12',
      usedIn: ['Cooking Tutorial'],
    },
    {
      id: '5',
      name: 'recipe-guide.pdf',
      type: 'document',
      size: '0.8 MB',
      url: '/placeholder-document.pdf',
      uploadDate: '2024-01-11',
      usedIn: ['Recipe Guide'],
    },
  ];

  const filteredMedia = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || file.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return FiImage;
      case 'video': return FiVideo;
      default: return FiFile;
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    console.log('Files to upload:', files);
    // Handle file upload logic here
  };

  const handleDeleteFile = (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      console.log('Delete file:', id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Media Management</h2>
          <p className="text-text-secondary">Upload and manage your media files</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <SafeIcon icon={FiUpload} className="w-5 h-5" />
            <span>Upload Files</span>
          </label>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search files..."
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary'}`}
            >
              <SafeIcon icon={FiGrid} className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary'}`}
            >
              <SafeIcon icon={FiList} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-text-secondary text-sm">Total Files</p>
          <p className="text-2xl font-bold text-text-primary">{mediaFiles.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-text-secondary text-sm">Images</p>
          <p className="text-2xl font-bold text-blue-500">
            {mediaFiles.filter(f => f.type === 'image').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-text-secondary text-sm">Videos</p>
          <p className="text-2xl font-bold text-purple-500">
            {mediaFiles.filter(f => f.type === 'video').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-text-secondary text-sm">Storage Used</p>
          <p className="text-2xl font-bold text-green-500">21.6 MB</p>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((file) => (
              <motion.div
                key={file.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {file.type === 'image' ? (
                    <ImageWithFallback
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <SafeIcon icon={getFileIcon(file.type)} className="w-12 h-12 text-text-secondary" />
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-text-primary text-sm truncate">
                    {file.name}
                  </h4>
                  <p className="text-text-secondary text-xs">
                    {file.size} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      file.type === 'image' 
                        ? 'bg-blue-100 text-blue-800' 
                        : file.type === 'video' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {file.type}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button className="text-blue-500 hover:text-blue-700">
                        <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Used In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedia.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <SafeIcon icon={getFileIcon(file.type)} className="w-8 h-8 text-text-secondary mr-3" />
                        <div>
                          <div className="text-sm font-medium text-text-primary">
                            {file.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        file.type === 'image' 
                          ? 'bg-blue-100 text-blue-800' 
                          : file.type === 'video' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {file.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {file.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {file.usedIn.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          <SafeIcon icon={FiDownload} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedia;
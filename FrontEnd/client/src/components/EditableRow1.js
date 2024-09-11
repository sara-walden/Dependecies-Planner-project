import React, { useState, useEffect } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { formatDateTime, priorityMap } from '../utils/utils'; // נייבא את הפונקציה החדשה
import DeleteRequest from './DeleteRequest'; // Add this line



const EditableRow = ({ row, columns, groups, statuses, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rowData, setRowData] = useState(row);
  const [editCell, setEditCell] = useState(null);
  const [productManagers, setProductManagers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [priorities, setPriorities] = useState([]);


  useEffect(() => {
    setRowData(row);
  }, [row]);

  useEffect(() => {
    const fetchProductManagers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/productManagers');
        setProductManagers(response.data);
      } catch (err) {
        console.error('Error fetching product managers:', err);
      }
    };

    const fetchAllGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/groups');
        setAllGroups(response.data);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };

    const fetchPriorities = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/priority');
        setPriorities(response.data);
      } catch (err) {
        console.error('Error fetching priorities:', err);
      }
    };

    fetchProductManagers();
    fetchAllGroups();
    fetchPriorities();
  }, []);


  const handleToggleEdit = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log('Updated Row Data:', rowData); // Debugging Line
      try {
        // אם העדכון הוא עבור priority
        if (rowData.priority !== row.priority) {
          const response = await axios.put(`http://localhost:3001/api/requests/${rowData.ID}/priority`, { priority: priorityMap[rowData.priority] });
          onUpdate(response.data);
        } else {
          const response = await axios.put(`http://localhost:3001/api/requests/${rowData.ID}`, rowData); // Updated URL to match the Postman example
          onUpdate(response.data);
        }
      } catch (err) {
        console.error('Error updating request:', err);
      }
    }
  };

  const handleDoubleClick = (columnId) => {
    if (isEditing) {
      setEditCell(columnId);
    }
  };

  const handleChange = (e, columnId) => {
    setRowData({ ...rowData, [columnId]: e.target.value });
  };

  const handleBlur = () => {
    setEditCell(null);
  };

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell>
        <IconButton onClick={handleToggleEdit} color={isEditing ? "primary" : "default"}>
          {isEditing ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </TableCell>
      {columns.map(column => (
        <TableCell
          key={column.id}
          onDoubleClick={() => handleDoubleClick(column.id)}
        >
          {isEditing && (column.id === 'title' || column.id === 'description' || column.id === 'comments') && editCell === column.id ? (
            <TextField
              value={rowData[column.id]}
              onChange={(e) => handleChange(e, column.id)}
              onBlur={handleBlur}
              autoFocus
            />
          ) : isEditing && column.id === 'priority' ? (
            <Select
              value={rowData[column.id] || ''}
              onChange={(e) => handleChange(e, column.id)}
              onBlur={handleBlur}
              autoFocus
            >
              {priorities.map(priority => (
                <MenuItem key={priority.id} value={priority.id}>
                  {priorityMap[priority.id]}
                </MenuItem>
              ))}
            </Select>
          ) : isEditing && column.id === 'requestorName' ? (
            <Select
              value={rowData[column.id] || ''}
              onChange={(e) => handleChange(e, column.id)}
              onBlur={handleBlur}
              autoFocus
            >
              {productManagers.map(manager => (
                <MenuItem key={manager.id} value={manager.name}>
                  {manager.name}
                </MenuItem>
              ))}
            </Select>
          ) : isEditing && column.id === 'requestGroup' ? (
            <Select
              value={rowData[column.id] || ''}
              onChange={(e) => handleChange(e, column.id)}
              onBlur={handleBlur}
              autoFocus
            >
              {allGroups.map(group => (
                <MenuItem key={group.id} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          ) : column.id === 'dateTime' ? (
            formatDateTime(rowData[column.id])
          ) : (
            column.id === 'priority' ? (
              priorityMap[rowData[column.id]] || rowData[column.id]
            ) : (
              rowData[column.id]
            )
          )}
        </TableCell>
      ))}
      {groups.map(group => (
        <TableCell key={group.id}>
          {isEditing ? (
            <Select
              value={rowData[group.id] || ''}
              onChange={(e) => handleChange(e, group.id)}
            >
              {statuses.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          ) : (
            rowData[group.id] || 'Not Required'
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default EditableRow;










































// import React, { useState, useEffect } from 'react';
// import TableCell from '@mui/material/TableCell';
// import TableRow from '@mui/material/TableRow';
// import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import axios from 'axios';
// import { formatDateTime, priorityMap } from '../utils/utils'; // נייבא את הפונקציה החדשה


// const EditableRow = ({ row, columns, groups, statuses, onUpdate }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [rowData, setRowData] = useState(row);
//   const [editCell, setEditCell] = useState(null);
//   const [productManagers, setProductManagers] = useState([]);
//   const [allGroups, setAllGroups] = useState([]);
//   const [priorities, setPriorities] = useState([]);


//   useEffect(() => {
//     setRowData(row);
//   }, [row]);



//   useEffect(() => {
//     const fetchProductManagers = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/productManagers');
//         setProductManagers(response.data);
//       } catch (err) {
//         console.error('Error fetching product managers:', err);
//       }
//     };

//     const fetchAllGroups = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/groups');
//         setAllGroups(response.data);
//       } catch (err) {
//         console.error('Error fetching groups:', err);
//       }
//     };

//     const fetchPriorities = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/priority');
//         setPriorities(response.data);
//       } catch (err) {
//         console.error('Error fetching priorities:', err);
//       }
//     };

//     fetchProductManagers();
//     fetchAllGroups();
//     fetchPriorities();
//   }, []);


//   const handleToggleEdit = async () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       console.log('Updated Row Data:', rowData);
//       console.log('Updated Row Data:', rowData);
//       try {
//         // אם העדכון הוא עבור priority
//         if (rowData.priority !== row.priority) {
//           const response = await axios.put(`http://localhost:3001/api/requests/${rowData.ID}/priority`, { priority: priorityMap[rowData.priority] });
//           onUpdate(response.data);
//         } else {
//           const response = await axios.put(`http://localhost:3001/api/requests/${rowData.ID}`, rowData); // Updated URL to match the Postman example
//           onUpdate(response.data);
//         }
//       } catch (err) {
//         console.error('Error updating request:', err);
//       }
//     }
//   };

//   const handleDoubleClick = (columnId) => {
//     if (isEditing) {
//       setEditCell(columnId);
//     }
//   };

//   const handleChange = (e, columnId) => {
//     setRowData({ ...rowData, [columnId]: e.target.value });
//   };

//   const handleBlur = () => {
//     setEditCell(null);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Pending Response':
//         return 'yellow';
//       case 'Not Required':
//         return 'gray';
//       case 'In Q':
//         return 'green';
//       case 'Not in Q':
//         return 'red';
//       default:
//         return 'transparent';
//     }
//   };

//   return (
//     <TableRow hover role="checkbox" tabIndex={-1}>
//       <TableCell>
//         <IconButton onClick={handleToggleEdit} color={isEditing ? "primary" : "default"}>
//           {isEditing ? <SaveIcon /> : <EditIcon />}
//         </IconButton>
//       </TableCell>
//       {columns.map(column => (
//         <TableCell
//           key={column.id}
//           onDoubleClick={() => handleDoubleClick(column.id)}
//         >
//           {isEditing && (column.id === 'title' || column.id === 'description' || column.id === 'comments') && editCell === column.id ? (
//             <TextField
//               value={rowData[column.id]}
//               onChange={(e) => handleChange(e, column.id)}
//               onBlur={handleBlur}
//               autoFocus
//             />
//           ) : isEditing && column.id === 'priority' ? (
//             <Select
//               value={rowData[column.id] || ''}
//               onChange={(e) => handleChange(e, column.id)}
//               onBlur={handleBlur}
//               autoFocus
//             >
//               {priorities.map(priority => (
//                 <MenuItem key={priority.id} value={priority.id}>
//                   {priorityMap[priority.id]}
//                 </MenuItem>
//               ))}
//             </Select>
//           ) : isEditing && column.id === 'requestorName' ? (
//             <Select
//               value={rowData[column.id] || ''}
//               onChange={(e) => handleChange(e, column.id)}
//               onBlur={handleBlur}
//               autoFocus
//             >
//               {productManagers.map(manager => (
//                 <MenuItem key={manager.id} value={manager.name}>
//                   {manager.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           ) : isEditing && column.id === 'requestGroup' ? (
//             <Select
//               value={rowData[column.id] || ''}
//               onChange={(e) => handleChange(e, column.id)}
//               onBlur={handleBlur}
//               autoFocus
//             >
//               {allGroups.map(group => (
//                 <MenuItem key={group.id} value={group.name}>
//                   {group.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           ) : column.id === 'dateTime' ? (
//             formatDateTime(rowData[column.id])
//           ) : (
//             column.id === 'priority' ? (priorityMap[rowData[column.id]] || rowData[column.id]) : (
//               rowData[column.id]
//             )
//           )}
//         </TableCell>
//       ))}
//       {groups.map(group => (
//         <TableCell
//           key={group.id}
//           style={{ backgroundColor: getStatusColor(rowData[group.id]) }}
//         >
//         <TableCell
//           key={group.id}
//           style={{ backgroundColor: getStatusColor(rowData[group.id]) }}
//         >
//           {isEditing ? (
//             <Select
//               value={rowData[group.id] || ''}
//               onChange={(e) => handleChange(e, group.id)}
//             >
//               {statuses.map(status => (
//                 <MenuItem key={status} value={status}>
//                   {status}
//                 </MenuItem>
//               ))}
//             </Select>
//           ) : (
//             rowData[group.id] || 'Not Required'
//           )}
//         </TableCell>
//         </TableCell>
//       ))}
//     </TableRow>
//   );
// };

// export default EditableRow;

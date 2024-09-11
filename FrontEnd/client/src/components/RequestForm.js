import React, { useState, useEffect, useRef } from 'react';
import { Chip, TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import axios from 'axios';
import { quarters } from '../config/quarters';
import { sendMessageToSlack } from './sendMessageToSlack';

export default function RequestForm({ onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestorName, setRequestorName] = useState('');
  const [priority, setPriority] = useState('');
  const [comments, setComments] = useState('');
  const [groups, setGroups] = useState([]);
  const [affectedGroupList, setAffectedGroupList] = useState([]);
  const [requestGroup, setRequestGroup] = useState('');
  const [planned, setPlanned] = useState('');
  const [jiraLink, setJiraLink] = useState('');
  const [pm, setPm] = useState([]);
  const [allPriority, setAllPriority] = useState([]);
  const [email, setEmail] = useState('');

  const isSubmitting = useRef(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Failed to fetch groups', error);
      }
    };

    const fetchPm = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/productManagers');
        setPm(response.data);
      } catch (error) {
        console.error('Failed to fetch PMs', error);
      }
    };

    const fetchPriority = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/priority');
        setAllPriority(response.data);
      } catch (error) {
        console.error('Failed to fetch priority', error);
      }
    };

    fetchPm();
    fetchGroups();
    fetchPriority();

    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      const response = await axios.post('http://localhost:3001/api/requests/createRequest', {
        title,
        description,
        requestorName,
        emailRequestor: email,
        priority,
        comments,
        affectedGroupList,
        requestGroup,
        planned,
        jiraLink
      });

      console.log('Response:', response.data);
      setTitle('');
      setDescription('');
      setRequestorName('');
      setPriority('');
      setComments('');
      setAffectedGroupList([]);
      setRequestGroup('');
      setPlanned('');
      setJiraLink('');

      // alert('Request added successfully!');
      onClose();
      sendMessageToSlack(`${email} Added a new request`);
    } catch (error) {
      console.error('Failed to add request', error);
      // alert('Failed to add request');
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleGroupChange = (event) => {
    const value = event.target.value;
    setAffectedGroupList(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      className="form"
      sx={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <h2>Request Form</h2>
      <TextField
        required
        id="title"
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        required
        id="description"
        label="Description"
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="requestorName-label">Requestor Name</InputLabel>
        <Select
          labelId="requestorName-label"
          id="requestorName"
          value={requestorName}
          onChange={(e) => setRequestorName(e.target.value)}
        >
          {pm.map(pm => (
            <MenuItem key={pm.id} value={pm.name}>{pm.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        required
        id="emailRequestor"
        label="Email Requestor"
        fullWidth
        margin="normal"
        value={email}
        disabled
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          labelId="priority-label"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {allPriority.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.priority}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        id="comments"
        label="Comments"
        fullWidth
        margin="normal"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="affectedGroup-label">Affected Groups</InputLabel>
        <Select
          labelId="affectedGroup-label"
          id="affectedGroups"
          multiple
          value={affectedGroupList}
          onChange={handleGroupChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={groups.find(group => group.id === value)?.name} />
              ))}
            </Box>
          )}
        >
          {groups.map(group => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="requestGroup-label">Request Group</InputLabel>
        <Select
          labelId="requestGroup-label"
          id="requestGroup"
          value={requestGroup}
          onChange={(e) => setRequestGroup(e.target.value)}
        >
          {groups.map(group => (
            <MenuItem key={group.id} value={group.name}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="planned">Planned</InputLabel>
        <Select
          labelId="planned"
          id="planned"
          value={planned}
          onChange={(e) => setPlanned(e.target.value)}
        >
          {quarters.map((quarter, index) => (
            <MenuItem key={index} value={quarter}>
              {quarter}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id="jiraLink"
        label="JIRA Link"
        fullWidth
        margin="normal"
        value={jiraLink}
        onChange={(e) => setJiraLink(e.target.value)}
      />
      <Box mt={2}>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
}

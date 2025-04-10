import { createLeaveRequest, getAllLeaveRequests, updateLeaveRequestStatus } from '../model/leaverequestModal.js';

export const createLeaveRequestHandler = async (req, res) => {
  const { leave_type, start_date, end_date, reason, employee_id } = req.body;

  try {
    await createLeaveRequest(employee_id, start_date, end_date, reason, leave_type);
    res.status(200).send('Leave request submitted successfully');
  } catch (error) {
    console.error('Error submitting leave request:', error);
    res.status(500).send('Error submitting leave request');
  }
};

export const getLeaveRequestsHandler = async (req, res) => {
  try {
    const leaveRequests = await getAllLeaveRequests();
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).send('Error fetching leave requests');
  }
};

export const updateLeaveRequestStatusHandler = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Add validation
  if (!status || !['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const result = await updateLeaveRequestStatus(id, status);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating leave request status:', error);
    res.status(500).json({ 
      message: error.message || 'Error updating leave request status' 
    });
  }
};
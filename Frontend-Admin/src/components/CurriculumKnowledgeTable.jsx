import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { curriculumKnowledgeService } from '../api/curriculumKnowledge';

const CurriculumKnowledgeTable = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        curriculumId: '',
        knowledgeName: '',
        description: '',
        status: 1
    });
    const [selectedCurriculumId, setSelectedCurriculumId] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [selectedCurriculumId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumKnowledgeService.getByKhungChuongTrinhId(selectedCurriculumId);
            console.log('API Response:', response.data);
            setData(response.data);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setSelectedItem(item);
            setFormData(item);
        } else {
            setSelectedItem(null);
            setFormData({
                curriculumId: '',
                knowledgeName: '',
                description: '',
                status: 1
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    };

    const handleSubmit = async () => {
        try {
            if (selectedItem) {
                await curriculumKnowledgeService.update(selectedItem.id, formData);
            } else {
                await curriculumKnowledgeService.create(formData);
            }
            handleClose();
            loadData();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await curriculumKnowledgeService.delete(id);
                loadData();
            } catch (error) {
                console.error('Error deleting data:', error);
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Chi Tiết Khung Chương Trình</Typography>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Chọn Khung Chương Trình</InputLabel>
                    <Select
                        value={selectedCurriculumId}
                        label="Chọn Khung Chương Trình"
                        onChange={(e) => setSelectedCurriculumId(e.target.value)}
                    >
                        <MenuItem value={1}>Khung Chương Trình 1</MenuItem>
                        <MenuItem value={2}>Khung Chương Trình 2</MenuItem>
                        <MenuItem value={3}>Khung Chương Trình 3</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>ID Nhóm Kiến Thức</TableCell>
                                <TableCell>ID Khung Chương Trình</TableCell>
                                <TableCell>Số Tín Chỉ Bắt Buộc</TableCell>
                                <TableCell>Số Tín Chỉ Tự Chọn</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.idNhomKienThuc}</TableCell>
                                        <TableCell>{row.idKhungChuongTrinh}</TableCell>
                                        <TableCell>{row.soTinChiBatBuoc}</TableCell>
                                        <TableCell>{row.soTinChiTuChon}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Không có dữ liệu
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {selectedItem ? 'Edit Curriculum Knowledge' : 'Add New Curriculum Knowledge'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Curriculum ID"
                            value={formData.curriculumId}
                            onChange={(e) => setFormData({ ...formData, curriculumId: e.target.value })}
                        />
                        <TextField
                            label="Knowledge Name"
                            value={formData.knowledgeName}
                            onChange={(e) => setFormData({ ...formData, knowledgeName: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={4}
                        />
                        <TextField
                            label="Status"
                            type="number"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedItem ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CurriculumKnowledgeTable; 
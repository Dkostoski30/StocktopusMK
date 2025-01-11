import React, { ReactNode } from 'react';
import { TablePagination, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface TableColumn {
    label: string;
    key: string;
    sortable?: boolean;
}

interface ReusableTableProps {
    columns: TableColumn[];
    data: any[];
    page: number;
    size: number;
    totalCount: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newSize: number) => void;
    onSort?: (key: string, order: 'asc' | 'desc') => void;
    sortBy?: string;
    sortOrder?: string|undefined;
    renderRow: (item: any) => ReactNode;
}

const ReusableTable: React.FC<ReusableTableProps> = ({
                                                         columns,
                                                         data,
                                                         page,
                                                         size,
                                                         totalCount,
                                                         onPageChange,
                                                         onRowsPerPageChange,
                                                         onSort,
                                                         sortBy,
                                                         sortOrder,
                                                         renderRow,
                                                     }) => {
    const handleSort = (key: string) => {
        if (onSort) {
            const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
            onSort(key, newOrder);
        }
    };

    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.key}>
                                {column.sortable ? (
                                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort(column.key)}>
                                        {column.label}
                                        {sortBy === column.key && (
                                            sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                                        )}
                                    </div>
                                ) : (
                                    column.label
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>{renderRow(item)}</TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(_, newPage) => onPageChange(newPage)}
                rowsPerPage={size}
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            />
        </div>
    );
};

export default ReusableTable;
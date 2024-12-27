import React from 'react';

interface User {
    username: string;
    mail: string;
    role: string;
}

interface UserTableProps {
    users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Username</th>
                <th>Mail</th>
                <th>Role</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user, index) => (
                <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.mail}</td>
                    <td>{user.role}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default UserTable;

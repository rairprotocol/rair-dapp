import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { rFetch } from '../../utils/rFetch';

type userType = {
  publicAddress: string;
  nickName: string;
  creationDate: Date;
  email: string;
  _id: string;
  blocked: string;
};
const UserManager = () => {
  const [userList, setUserList] = useState<userType[]>([]);

  const getUserData = useCallback(async () => {
    const { success, data } = await rFetch('/api/users/list');
    if (success) {
      setUserList(data);
    }
  }, []);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <>
      <div className="row mb-5">
        <button
          onClick={async () => {
            axios
              .get('/api/users/export', { responseType: 'blob' })
              .then((response) => response.data)
              .then((blob) => {
                // Create blob link to download
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `template.csv`);

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode?.removeChild(link);
              });
          }}
          className="col-2 btn btn-primary">
          Export
        </button>
      </div>
      <table className="table table-dark table-responsive">
        <thead>
          <th />
          <th>Date Created</th>
          <th>Username</th>
          <th>Public Address</th>
          <th>Email</th>
        </thead>
        <tbody>
          {userList.map((user, index) => {
            return (
              <tr key={index}>
                <td>
                  <button
                    onClick={async () => {
                      await rFetch(`/api/users/${user.publicAddress}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                          blocked: !user.blocked
                        }),
                        headers: {
                          'content-type': 'application/json'
                        }
                      });
                      getUserData();
                    }}
                    className={`btn btn-${
                      user.blocked ? 'success' : 'danger'
                    }`}>
                    {user.blocked ? 'Unban' : 'Ban'}
                  </button>
                </td>
                <td>{user.creationDate.toString()}</td>
                <td>{user.nickName}</td>
                <td>{user.publicAddress}</td>
                <td>{user.email}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default UserManager;

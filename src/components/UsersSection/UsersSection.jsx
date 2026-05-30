import { useState, useEffect } from "react";
import { Card, Table, Badge, Button, Pagination } from "react-bootstrap";
import UsersFilters from "../UsersFilters/UsersFilters";
import EditUserModal from "../EditUserModal/EditUserModal";
import DeleteConfirmModal from "../DeleteConfirmModal/DeleteConfirmModal";
import { instance } from "../../config/api";
import { useSelector } from "react-redux";

const UsersSection = () => {
  const currentUserId = useSelector((currentState) => currentState.profile.user?.id);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  /* const [loading, setLoading] = useState(false); */
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    username: "",
    email: "",
    role: "",
    active: "ALL",
  });

  const [queryFilters, setQueryFilters] = useState({
    username: "",
    email: "",
    role: "",
    active: "ALL",
    page: 0,
    size: 10,
    sortBy: "username",
    order: "asc",
  });

  const getUsers = (params) => {
    const searchParams = new URLSearchParams({
      ...(params.username && { username: params.username }),
      ...(params.email && { email: params.email }),
      ...(params.role && { role: params.role }),
      ...(params.active !== "ALL" && {
        active: params.active,
      }),
      page: params.page || 0,
      size: params.size || 10,
      sortBy: params.sortBy || "username",
      order: params.order || "asc",
    });

    instance
      .get("/users?" + searchParams.toString())
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUsers(queryFilters);
  }, [queryFilters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setQueryFilters((prev) => ({
      ...prev,
      ...filters,
      page: 0,
    }));
  };

  const handlePageChange = (page) => {
    setQueryFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSaveUser = () => {
    getUsers(queryFilters);

    setShowModal(false);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const handleDeleteUser = () => {
    instance
      .delete("/users/" + userToDelete.id)
      .then((response) => {
        console.log(response);
        getUsers(queryFilters);
      })
      .catch((err) => console.log(err))
      .finally(() => setUserToDelete(null));
  };

  const handleDeleteCancel = () => {
    setUserToDelete(null);
  };
  return (
    <>
      <UsersFilters filters={filters} handleFilterChange={handleFilterChange} handleSearch={handleSearch} />

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <Table responsive hover align="middle">
            <thead>
              <tr>
                <th>Username</th>
                <th className="d-none d-md-table-cell">Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td className="d-none d-md-table-cell">{user.email}</td>
                  <td>
                    <Badge bg={user.role === "ADMIN" ? "danger" : "dark"}>{user.role}</Badge>
                  </td>
                  <td>
                    <Badge bg={user.active === true ? "success" : "warning"}>{user.active ? "Active" : "Suspended"}</Badge>
                  </td>
                  <td className="align-middle text-center">
                    <div className="d-flex flex-column gap-3">
                      <Button
                        disabled={user.id === currentUserId}
                        size="sm"
                        variant={user.id === currentUserId ? "outline-secondary" : "outline-primary"}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        disabled={user.id === currentUserId}
                        size="sm"
                        variant={user.id === currentUserId ? "outline-secondary" : "outline-danger"}
                        onClick={() => handleDeleteClick(user)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.Prev disabled={queryFilters.page === 0} onClick={() => handlePageChange(queryFilters.page - 1)} />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i} active={queryFilters.page === i} onClick={() => handlePageChange(i)}>
                  {i + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next disabled={queryFilters.page + 1 >= totalPages} onClick={() => handlePageChange(queryFilters.page + 1)} />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      {showModal && (
        <EditUserModal key={selectedUser?.id} show={showModal} onHide={() => setShowModal(false)} user={selectedUser} handleSaveUser={handleSaveUser} />
      )}

      <DeleteConfirmModal show={!!userToDelete} onHide={handleDeleteCancel} onConfirm={handleDeleteUser} username={userToDelete?.username} />
    </>
  );
};

export default UsersSection;

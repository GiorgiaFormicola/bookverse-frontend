import { useState, useEffect, useRef } from "react";
import { Card, Table, Badge, Button, Pagination, Spinner } from "react-bootstrap";
import UsersFilters from "./UsersFilters";
import EditUserModal from "./EditUserModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { instance } from "../config/api";
import { useSelector } from "react-redux";

const UsersSection = () => {
  const currentUserId = useSelector((currentState) => currentState.profile.user?.id);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);
  const tableRef = useRef(null);
  const shouldScrollRef = useRef(false);

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

  const getVisiblePages = () => {
    const maxVisible = 6;
    let start = Math.max(0, queryFilters.page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end >= totalPages) {
      end = totalPages - 1;
      start = Math.max(0, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

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
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
        setIsFirst(response.data.first);
        setIsLast(response.data.last);
      })
      .catch((err) => {
        if (err.handled) return;
        if (err.response?.status >= 500) {
          window.location.replace("/error?type=server");
          return;
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getUsers(queryFilters);
  }, [queryFilters]);

  useEffect(() => {
    if (!loading && shouldScrollRef.current) {
      shouldScrollRef.current = false;
      const top = (tableRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 70;
      window.scrollTo({ top, behavior: "auto" });
    }
  }, [loading]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    if (loading) return;
    setLoading(true);
    setQueryFilters((prev) => ({
      ...prev,
      ...filters,
      page: 0,
    }));
  };

  const handlePageChange = (page) => {
    if (loading) return;
    if (page === queryFilters.page) return;
    setLoading(true);
    shouldScrollRef.current = true;
    const top = (tableRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 70;
    window.scrollTo({ top, behavior: "smooth" });
    setQueryFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSaveUser = () => {
    setLoading(true);
    getUsers(queryFilters);
    setShowModal(false);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };

  const handleDeleteUser = () => {
    return instance
      .delete("/users/" + userToDelete.id)
      .then(() => {
        setLoading(true);
        getUsers(queryFilters);
        setUserToDelete(null);
      })
      .catch((err) => {
        if (err.handled) return;
        if (err.response?.status >= 500) {
          window.location.replace("/error?type=server");
          return;
        }
      });
  };

  const handleDeleteCancel = () => {
    setUserToDelete(null);
  };
  return (
    <>
      {/* Filters */}
      <UsersFilters filters={filters} handleFilterChange={handleFilterChange} handleSearch={handleSearch} loading={loading} />

      {/* Table */}
      <Card ref={tableRef} className="border-0 rounded-4 mt-3 overflow-hidden" style={{ background: "var(--surface-raised)" }}>
        <Card.Body className="px-4 py-2">
          <Table responsive hover align="middle" className="bv-admin-table mb-0">
            <thead>
              <tr>
                <th>Username</th>
                <th className="d-none d-md-table-cell">Email</th>
                <th className="d-sm-none">Info</th>
                <th className="d-none d-sm-table-cell">Role</th>
                <th className="d-none d-sm-table-cell">Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="d-flex gap-3 justify-content-center align-items-center">
                      <Spinner animation="grow" size="sm" style={{ color: "var(--primary-light)" }} />
                      <Spinner animation="grow" size="sm" style={{ color: "var(--accent)" }} />
                      <Spinner animation="grow" size="sm" style={{ color: "var(--st-review)" }} />
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td className="d-none d-md-table-cell">{user.email}</td>
                    <td className="d-sm-none">
                      <div className="d-flex flex-column gap-3">
                        <Badge bg={user.role === "ADMIN" ? "danger" : "secondary"}>{user.role}</Badge>
                        <Badge bg={user.active === true ? "read" : "toread"}>{user.active ? "Active" : "Suspended"}</Badge>
                      </div>
                    </td>
                    <td className="d-none d-sm-table-cell">
                      <Badge bg={user.role === "ADMIN" ? "danger" : "secondary"}>{user.role}</Badge>
                    </td>
                    <td className="d-none d-sm-table-cell">
                      <Badge bg={user.active === true ? "read" : "toread"}>{user.active ? "Active" : "Suspended"}</Badge>
                    </td>
                    <td className="align-middle text-center">
                      <div className="d-flex flex-column gap-3">
                        <Button
                          disabled={user.id === currentUserId}
                          size="sm"
                          className={user.id === currentUserId ? "bv-btn-close" : "bv-btn-edit"}
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
                          className={user.id === currentUserId ? "bv-btn-close" : "bv-btn-delete"}
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-3">
            {/* Pagination */}
            <Pagination className="bv-pagination mb-0">
              <Pagination.Prev
                disabled={isFirst || loading}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(queryFilters.page - 1);
                }}
              />
              {getVisiblePages().map((i) => (
                <Pagination.Item
                  key={i}
                  active={queryFilters.page === i}
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i);
                  }}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={isLast || loading}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(queryFilters.page + 1);
                }}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      {/* Modals */}
      {showModal && (
        <EditUserModal key={selectedUser?.id} show={showModal} onHide={() => setShowModal(false)} user={selectedUser} handleSaveUser={handleSaveUser} />
      )}
      <DeleteConfirmModal show={!!userToDelete} onHide={handleDeleteCancel} onConfirm={handleDeleteUser} username={userToDelete?.username} />
    </>
  );
};

export default UsersSection;

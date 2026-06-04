import { useState, useRef } from "react";
import { Modal, Row, Col, Form, InputGroup, Button, Spinner } from "react-bootstrap";
import { instance } from "../config/api";

const EditBookModal = ({ show, onHide, book, handleSaveBook }) => {
  const [form, setForm] = useState(book);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const isLocked = (field) => !isEmpty(book[field]);

  if (!book || !form) return null;
  const isEmpty = (val) => {
    if (Array.isArray(val)) return val.length === 0;
    return val === null || val === undefined || val === "";
  };

  const shouldSend = (original, current) => {
    const changed = Array.isArray(original) ? JSON.stringify(original) !== JSON.stringify(current) : original !== current;

    if (!changed) return false;
    if (!isEmpty(original) && isEmpty(current)) return false;
    return true;
  };

  const isInvalidClear = (original, current) => {
    return !isEmpty(original) && isEmpty(current);
  };

  const hasInvalidClears = () => {
    return (
      isInvalidClear(book.title, form.title) ||
      isInvalidClear(book.description, form.description) ||
      isInvalidClear(book.publisher, form.publisher) ||
      isInvalidClear(book.publishedDate, form.publishedDate) ||
      isInvalidClear(book.isbn10, form.isbn10) ||
      isInvalidClear(book.isbn13, form.isbn13) ||
      isInvalidClear(book.pages, form.pages) ||
      isInvalidClear(book.authors, form.authors) ||
      isInvalidClear(book.categories, form.categories)
    );
  };

  const canSave =
    !hasInvalidClears() &&
    (shouldSend(book.title, form.title) ||
      shouldSend(book.description, form.description) ||
      shouldSend(book.publisher, form.publisher) ||
      shouldSend(book.publishedDate, form.publishedDate) ||
      shouldSend(book.isbn10, form.isbn10) ||
      shouldSend(book.isbn13, form.isbn13) ||
      shouldSend(book.pages, form.pages) ||
      shouldSend(book.authors, form.authors) ||
      shouldSend(book.categories, form.categories) ||
      coverFile);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (
        shouldSend(book.title, form.title) ||
        shouldSend(book.description, form.description) ||
        shouldSend(book.publisher, form.publisher) ||
        shouldSend(book.publishedDate, form.publishedDate) ||
        (isEmpty(book.isbn10) && shouldSend(book.isbn10, form.isbn10)) ||
        (isEmpty(book.isbn13) && shouldSend(book.isbn13, form.isbn13)) ||
        (!isEmpty(form.pages) && shouldSend(book.pages, form.pages))
      ) {
        await instance.put(`/books/${book.googleId}`, {
          title: form.title,
          publisher: form.publisher,
          publishedDate: form.publishedDate,
          description: form.description,
          isbn10: form.isbn10,
          isbn13: form.isbn13,
          pages: Number(form.pages),
        });
      }

      if (shouldSend(book.authors, form.authors)) {
        await instance.patch(`/books/${book.googleId}/authors`, { authors: form.authors });
      }

      if (shouldSend(book.categories, form.categories)) {
        await instance.patch(`/books/${book.googleId}/categories`, { categories: form.categories });
      }

      if (coverFile) {
        const formData = new FormData();
        formData.append("book_cover", coverFile);
        await instance.patch(`/books/${book.googleId}/cover`, formData);
      }

      handleSaveBook();
    } catch (err) {
      if (err.handled) return;
      setSaveError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Book</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="g-3">
          {/* Cover */}
          <Col md={4} className="mb-2">
            <Form.Group>
              <Form.Label>Cover</Form.Label>
              <div className="mb-2">
                <img src={coverPreview ?? form.coverURL} alt="cover preview" className="rounded border book-cover" />
              </div>
              <InputGroup>
                <Form.Control type="file" accept="image/*" ref={fileInputRef} onChange={handleCoverChange} className="d-none" id="cover-upload" />
                <Form.Label htmlFor="cover-upload" className="btn bv-btn-edit mb-0 flex-grow-1 rounded-start-pill cursor-pointer">
                  {coverFile ? coverFile.name : "Choose file"}
                </Form.Label>
                {coverFile && (
                  <Button className="bv-btn-close" onClick={handleRemoveCover}>
                    ✕
                  </Button>
                )}
              </InputGroup>
            </Form.Group>
          </Col>

          {/* Description */}
          <Col md={8} className="mb-2">
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                className="py-2"
                as="textarea"
                rows={15}
                value={form.description ?? ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control value={form.title ?? ""} onChange={(e) => updateField("title", e.target.value)} />
            </Form.Group>
          </Col>

          {/* Authors */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>Authors</Form.Label>

              <Form.Control
                value={(form.authors ?? []).join(", ")}
                onChange={(e) =>
                  updateField(
                    "authors",
                    e.target.value
                      .split(",")
                      .map((a) => a.trim())
                      .filter(Boolean),
                  )
                }
              />
            </Form.Group>
          </Col>

          {/* Publisher */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>Publisher</Form.Label>
              <Form.Control value={form.publisher ?? ""} onChange={(e) => updateField("publisher", e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>Categories</Form.Label>
              <Form.Control
                value={(form.categories ?? []).join(", ")}
                onChange={(e) =>
                  updateField(
                    "categories",
                    e.target.value
                      .split(",")
                      .map((c) => c.trim())
                      .filter(Boolean),
                  )
                }
              />
            </Form.Group>
          </Col>

          {/* Date */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>Published date</Form.Label>
              <Form.Control
                type="text"
                value={form.publishedDate ?? ""}
                placeholder="es. 2023, 2023-06, 2023-06-15"
                onChange={(e) => updateField("publishedDate", e.target.value)}
              />
            </Form.Group>
          </Col>

          {/* Pages*/}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Pages</Form.Label>
              <Form.Control type="number" min={1} value={form.pages ?? ""} onChange={(e) => updateField("pages", e.target.value)} />
            </Form.Group>
          </Col>

          {/* ISBN-10 */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>ISBN-10</Form.Label>
              <Form.Control
                value={form.isbn10 ?? ""}
                disabled={isLocked("isbn10")}
                maxLength={10}
                placeholder={isLocked("isbn10") ? "already setted" : ""}
                onChange={(e) => updateField("isbn10", e.target.value)}
              />
            </Form.Group>
          </Col>

          {/* ISBN-13 */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>ISBN-13</Form.Label>
              <Form.Control
                value={form.isbn13 ?? ""}
                disabled={isLocked("isbn13")}
                maxLength={13}
                placeholder={isLocked("isbn13") ? "alredy setted" : ""}
                onChange={(e) => updateField("isbn13", e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <div className="w-100">
          <div className={"alert bg-transparent border-0 p-0 mb-2 text-center" + (saveError ? " alert-danger" : " invisible")}>
            {saveError || "placeholder"}
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <Button className="bv-btn-close" onClick={onHide}>
              Cancel
            </Button>
            <Button disabled={!canSave || loading} className="bv-btn-confirm" onClick={() => handleSave()}>
              {loading ? <Spinner animation="border" size="sm" style={{ color: "var(--bg-deep)" }} /> : "Save Book"}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBookModal;

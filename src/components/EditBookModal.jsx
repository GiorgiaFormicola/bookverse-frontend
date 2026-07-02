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

  if (!book || !form) return null;
  const isEmpty = (val) => {
    if (Array.isArray(val)) return val.length === 0;
    return val === null || val === undefined || val === "";
  };

  const isInvalidClear = (original, current) => {
    return !isEmpty(original) && isEmpty(current);
  };

  const isValidIsbn10 = (value) => isEmpty(value) || /^\d{9}[\dXx]$/.test(value.trim());
  const isValidIsbn13 = (value) => isEmpty(value) || /^\d{13}$/.test(value.trim());

  const isValidPages = (value) => isEmpty(value) || (/^\d+$/.test(String(value).trim()) && Number(value) >= 1);

  const isValidPublishedDate = (value) => {
    if (isEmpty(value)) return true;
    const match = /^(\d{4})(-(\d{2})(-(\d{2}))?)?$/.exec(value.trim());
    if (!match) return false;
    const month = match[3] ? Number(match[3]) : null;
    const day = match[5] ? Number(match[5]) : null;
    if (month !== null && (month < 1 || month > 12)) return false;
    if (day !== null && (day < 1 || day > 31)) return false;
    return true;
  };

  const titleClearInvalid = isInvalidClear(book.title, form.title);
  const publisherClearInvalid = isInvalidClear(book.publisher, form.publisher);
  const publishedDateClearInvalid = isInvalidClear(book.publishedDate, form.publishedDate);
  const descriptionClearInvalid = isInvalidClear(book.description, form.description);
  const isbn10ClearInvalid = isInvalidClear(book.isbn10, form.isbn10);
  const isbn13ClearInvalid = isInvalidClear(book.isbn13, form.isbn13);
  const pagesClearInvalid = isInvalidClear(book.pages, form.pages);

  const isbn10Invalid = isbn10ClearInvalid || (!isEmpty(form.isbn10) && !isValidIsbn10(form.isbn10));
  const isbn13Invalid = isbn13ClearInvalid || (!isEmpty(form.isbn13) && !isValidIsbn13(form.isbn13));
  const pagesInvalid = pagesClearInvalid || (!isEmpty(form.pages) && !isValidPages(form.pages));
  const publishedDateInvalid = publishedDateClearInvalid || (!isEmpty(form.publishedDate) && !isValidPublishedDate(form.publishedDate));

  const authorsCleared = isInvalidClear(book.authors, form.authors);
  const categoriesCleared = isInvalidClear(book.categories, form.categories);

  const shouldSend = (original, current) => {
    const changed = Array.isArray(original) ? JSON.stringify(original) !== JSON.stringify(current) : original !== current;

    if (!changed) return false;
    if (!isEmpty(original) && isEmpty(current)) return false;
    return true;
  };

  const shouldSendClearable = (original, current) => {
    return Array.isArray(original) ? JSON.stringify(original) !== JSON.stringify(current) : original !== current;
  };

  const canSave =
    !titleClearInvalid &&
    !publisherClearInvalid &&
    !publishedDateClearInvalid &&
    !descriptionClearInvalid &&
    !pagesClearInvalid &&
    !isbn10Invalid &&
    !isbn13Invalid &&
    !pagesInvalid &&
    !publishedDateInvalid &&
    (shouldSend(book.title, form.title) ||
      shouldSend(book.description, form.description) ||
      shouldSend(book.publisher, form.publisher) ||
      shouldSend(book.publishedDate, form.publishedDate) ||
      shouldSend(book.isbn10, form.isbn10) ||
      shouldSend(book.isbn13, form.isbn13) ||
      shouldSend(book.pages, form.pages) ||
      shouldSendClearable(book.authors, form.authors) ||
      shouldSendClearable(book.categories, form.categories) ||
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

  const handleClose = () => {
    if (loading) return;
    onHide();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (
        shouldSend(book.title, form.title) ||
        shouldSend(book.description, form.description) ||
        shouldSend(book.publisher, form.publisher) ||
        shouldSend(book.publishedDate, form.publishedDate) ||
        shouldSend(book.isbn10, form.isbn10) ||
        shouldSend(book.isbn13, form.isbn13) ||
        shouldSend(book.pages, form.pages)
      ) {
        await instance.put(`/books/${book.googleId}`, {
          title: form.title,
          publisher: form.publisher,
          publishedDate: form.publishedDate?.trim(),
          description: form.description,
          isbn10: form.isbn10?.trim(),
          isbn13: form.isbn13?.trim(),
          pages: Number(form.pages),
        });
      }

      if (shouldSendClearable(book.authors, form.authors)) {
        await instance.patch(`/books/${book.googleId}/authors`, { authors: form.authors });
      }

      if (shouldSendClearable(book.categories, form.categories)) {
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
    <Modal size="lg" show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Edit Book</Modal.Title>
        <button type="button" className="btn-close" aria-label="Close" disabled={loading} onClick={handleClose}></button>
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
                isInvalid={descriptionClearInvalid}
                value={form.description ?? ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">Description can't be cleared</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control isInvalid={titleClearInvalid} value={form.title ?? ""} onChange={(e) => updateField("title", e.target.value)} />
              <Form.Control.Feedback type="invalid">Title can't be cleared</Form.Control.Feedback>
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
              {authorsCleared && <Form.Text className="text-muted d-block">This will remove all authors</Form.Text>}
            </Form.Group>
          </Col>

          {/* Publisher */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>Publisher</Form.Label>
              <Form.Control isInvalid={publisherClearInvalid} value={form.publisher ?? ""} onChange={(e) => updateField("publisher", e.target.value)} />

              <Form.Control.Feedback type="invalid">Publisher can't be cleared</Form.Control.Feedback>
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
              {categoriesCleared && <Form.Text className="text-muted d-block">This will remove all categories</Form.Text>}
            </Form.Group>
          </Col>

          {/* Date */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>Published date</Form.Label>
              <Form.Control
                type="text"
                isInvalid={publishedDateInvalid}
                value={form.publishedDate ?? ""}
                placeholder="es. 2023, 2023-06, 2023-06-15"
                onChange={(e) => updateField("publishedDate", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {publishedDateClearInvalid ? "Published date can't be cleared" : "Use YYYY, YYYY-MM or YYYY-MM-DD (e.g. 2023-06-15)"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* Pages*/}
          <Col md={6}>
            <Form.Group>
              <Form.Label>Pages</Form.Label>
              <Form.Control type="number" min={1} isInvalid={pagesInvalid} value={form.pages ?? ""} onChange={(e) => updateField("pages", e.target.value)} />
              <Form.Control.Feedback type="invalid">
                {pagesClearInvalid ? "Pages count can't be cleared" : "Pages count must be a whole number of 1 or more"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* ISBN-10 */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>ISBN-10</Form.Label>
              <Form.Control
                value={form.isbn10 ?? ""}
                isInvalid={isbn10Invalid}
                maxLength={10}
                placeholder="es. 0306406152"
                onChange={(e) => updateField("isbn10", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {isbn10ClearInvalid ? "ISBN-10 can't be cleared" : "ISBN-10 must be 9 digits followed by a digit or X"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* ISBN-13 */}
          <Col md={6} className="mb-2">
            <Form.Group>
              <Form.Label>ISBN-13</Form.Label>
              <Form.Control
                value={form.isbn13 ?? ""}
                isInvalid={isbn13Invalid}
                maxLength={13}
                placeholder="es. 9780306406157"
                onChange={(e) => updateField("isbn13", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {isbn13ClearInvalid ? "ISBN-13 can't be cleared" : "ISBN-13 must be exactly 13 digits"}
              </Form.Control.Feedback>
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
            <Button disabled={loading} className="bv-btn-close" onClick={handleClose}>
              Cancel
            </Button>
            <Button disabled={!canSave || loading} className="bv-btn-confirm" onClick={() => handleSave()}>
              {loading ? <Spinner animation="border" size="sm" className="mx-4" style={{ color: "var(--bg-deep)" }} /> : "Save Book"}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBookModal;

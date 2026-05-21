import { Row, Col, Form, InputGroup, Button, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useState } from "react";
const SearchComponent = (props) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("title");

  const updateSearch = (newQuery, newFilter) => {
    const params = {
      query: newQuery,
      filter: newFilter,
    };
    props.onSearch(params);
  };

  return (
    <Row>
      <Col>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            updateSearch(query, filter);
          }}
        >
          <InputGroup>
            <Form.Control className="rounded-start-pill" type="search" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button type="submit" className="rounded-end-pill bg-dark" disabled={!query.trim()}>
              <Search className="mb-1"></Search>
            </Button>
          </InputGroup>
        </Form>
        <ToggleButtonGroup
          type="radio"
          name="filters"
          defaultValue={filter}
          onChange={(value) => {
            setFilter(value);
            updateSearch(query, value);
          }}
        >
          <ToggleButton id="tbg-btn-1" value={"title"}>
            Title
          </ToggleButton>
          <ToggleButton id="tbg-btn-2" value={"author"}>
            Author
          </ToggleButton>
          <ToggleButton id="tbg-btn-3" value={"category"}>
            Category
          </ToggleButton>
          <ToggleButton id="tbg-btn-4" value={"publisher"}>
            Publisher
          </ToggleButton>
        </ToggleButtonGroup>
      </Col>
    </Row>
  );
};

export default SearchComponent;

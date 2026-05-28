const BookStat = ({ children, statValue, statName }) => {
  return (
    <div className="bg-dark rounded-3 d-flex h-100 w-50 align-items-center px-2 px-sm-4 p-lg-2 justify-content-between" /* ADD STAT-CARD CLASS */>
      {children}
      <div className="text-end small">
        <p className="mb-0">{statValue}</p>
        <p className="mb-0">{statName}</p>
      </div>
    </div>
  );
};

export default BookStat;

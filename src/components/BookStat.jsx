const BookStat = ({ children, statValue, statName, color = "saved" }) => {
  return (
    <div className="bv-book-stat d-flex justify-content-between align-items-center px-4 py-3 px-sm-3 px-lg-2 w-100">
      <div className={`bv-book-stat__icon bv-book-stat__icon--${color} rounded-2 p-sm-2 p-md-3 p-lg-2 p-xxl-3`}>{children}</div>
      <div className="text-end">
        <p className="mb-2 bv-book-stat__value mb-lg-0 mb-xl-2">{statValue}</p>
        <p className="mb-0 bv-book-stat__label d-lg-none d-xl-block">{statName}</p>
      </div>
    </div>
  );
};

export default BookStat;

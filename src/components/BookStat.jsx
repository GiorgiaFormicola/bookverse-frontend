const BookStat = ({ children, statValue, statName, color = "saved" }) => {
  return (
    <div className="bv-book-stat px-lg-2">
      <div className={`bv-book-stat__icon bv-book-stat__icon--${color}`}>{children}</div>
      <div className="text-end">
        <p className="bv-book-stat__value mb-0">{statValue}</p>
        <p className="bv-book-stat__label mb-0 d-none d-sm-block d-lg-none d-xl-block">{statName}</p>
      </div>
    </div>
  );
};

export default BookStat;

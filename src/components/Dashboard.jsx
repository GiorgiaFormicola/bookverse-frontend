import { useSelector } from "react-redux";
import DashboardCard from "./DashboardCard";
import { HeartFill, BookFill, Book, BookHalf } from "react-bootstrap-icons";
const Dashboard = ({ size }) => {
  const library = useSelector((currentState) => currentState.profile.savedBooks);

  const stats = Object.values(library).reduce(
    (acc, book) => {
      acc.saved++;
      if (book.status === "READ") acc.read++;
      if (book.status === "TO_READ") acc.toRead++;
      if (book.status === "READING") acc.reading++;
      return acc;
    },
    { saved: 0, read: 0, toRead: 0, reading: 0 },
  );

  return (
    <>
      {size === "xs" && (
        <>
          <DashboardCard statName="Saved" statValue={stats.saved}>
            <HeartFill size={40} className="text-danger" />
          </DashboardCard>
          <DashboardCard statName="Read" statValue={stats.read}>
            <BookFill size={40} className="text-success" />
          </DashboardCard>
          <DashboardCard statName="To read" statValue={stats.toRead}>
            <Book size={40} className="text-warning" />
          </DashboardCard>
          <DashboardCard statName="Reading" statValue={stats.reading}>
            <BookHalf size={40} className="text-info" />
          </DashboardCard>
        </>
      )}

      {size === "sm" && (
        <>
          <DashboardCard statName="Books saved" statValue={stats.saved}>
            <HeartFill size={50} className="text-danger" />
          </DashboardCard>
          <DashboardCard statName="Books read" statValue={stats.read}>
            <BookFill size={50} className="text-success" />
          </DashboardCard>
          <DashboardCard statName="Currently reading" statValue={stats.reading}>
            <BookHalf size={50} className="text-info" />
          </DashboardCard>
          <DashboardCard statName="Books to read" statValue={stats.toRead}>
            <Book size={50} className="text-warning" />
          </DashboardCard>
        </>
      )}

      {size === "lg" && (
        <>
          <DashboardCard statName="Books saved" statValue={stats.saved}>
            <HeartFill size={45} className="text-danger" />
          </DashboardCard>
          <DashboardCard statName="Books read" statValue={stats.read}>
            <BookFill size={45} className="text-success" />
          </DashboardCard>
          <DashboardCard statName="Currently reading" statValue={stats.reading}>
            <BookHalf size={45} className="text-info" />
          </DashboardCard>
          <DashboardCard statName="Books to read" statValue={stats.toRead}>
            <Book size={45} className="text-warning" />
          </DashboardCard>
        </>
      )}
    </>
  );
};

export default Dashboard;

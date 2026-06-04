import { useSelector } from "react-redux";
import DashboardCard from "./DashboardCard";
import { BookmarkFill } from "react-bootstrap-icons";
import { Book, BookCheck, BookOpen } from "lucide-react";
const Dashboard = () => {
  const library = useSelector((currentState) => currentState.profile.savedBooks);

  const stats = Object.values(library ?? {}).reduce(
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
      <DashboardCard statName="Books saved" statValue={stats.saved} color="saved">
        <BookmarkFill size={24} className="text-saved" />
      </DashboardCard>
      <DashboardCard statName="Books read" statValue={stats.read} color="read">
        <BookCheck size={30} className="text-read" />
      </DashboardCard>
      <DashboardCard statName="Now reading" statValue={stats.reading} color="reading">
        <BookOpen size={30} className="text-reading" />
      </DashboardCard>
      <DashboardCard statName="Books to read" statValue={stats.toRead} color="toread">
        <Book size={30} className="text-toread" />
      </DashboardCard>
    </>
  );
};

export default Dashboard;

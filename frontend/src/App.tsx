import { useState } from "react";
import "./App.css";
import ListPost from "./components/ListPosts";
import Posts from "./components/Posts";

function App() {
  const [refreshList, setRefreshList] = useState<boolean>(false);

  const handlePostAdded = () => {
    setRefreshList(true);
  };

  return (
    <>
          <Posts onPostAdded={handlePostAdded} />
          <ListPost refreshList={refreshList} setRefreshList={setRefreshList} />
    </>
  );
}

export default App;

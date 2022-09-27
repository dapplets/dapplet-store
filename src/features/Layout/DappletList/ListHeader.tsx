import { Header as SemanticHeader } from "semantic-ui-react";
import styles from "../ListHeader.module.scss";
import { INITIAL_STATE as SORT_INITIAL_STATE } from "../../../models/sort";

type Props = {
  title: string;
  setSort: any;
};

const Header = ({ title, setSort }: Props) => {
  const resetSortAndFiltering = () => {
    setSort(SORT_INITIAL_STATE);
  };

  const isMyDappletsList = title === "My Dapplets";

  return (
    <div
      style={{
        display: "flex",
        margin: "30px 35px 15px",
        alignItems: "baseline",
        justifyContent: "space-between",
        height: 30,
      }}
    >
      <SemanticHeader
        as="h2"
        className="infoTitle"
        size="medium"
        style={{
          flexGrow: 1,
        }}
      >
        {title}
      </SemanticHeader>
      {isMyDappletsList && (
        <button className={styles.button} onClick={resetSortAndFiltering}>
          Show All
        </button>
      )}
    </div>
  );
};

export default Header;

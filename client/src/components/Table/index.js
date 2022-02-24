import React, { useState } from "react";

import useTable from "../../hooks/useTable";
import styles from "./Table.module.css";
import TableFooter from "./TableFooter";
import 'bootstrap/dist/css/bootstrap.min.css';

const Table = ({ data, rowsPerPage }) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);

  return (
    <>
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}>No</th>
            <th className={styles.tableHeader}>File Name</th>
            <th className={styles.tableHeader}>File Hash</th>
            <th className={styles.tableHeader}>Retrieval</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((el) => (
            <tr className={styles.tableRowItems} key={el.id}>
              <td className={styles.tableCell}>{el.id}</td>
              <td className={styles.tableCell}>{el.fileNames}</td>
              <td className={styles.tableCell}>{el.fileHashes}</td>
              <td className={styles.tableCell}>
                <a href={"https://ipfs.infura.io/ipfs/" + el.fileHashes} target="_blank" rel="noreferrer">
                    <button className="btn btn-warning">Retrieve</button>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

export default Table;
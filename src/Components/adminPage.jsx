import React, { useEffect, useReducer, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Search } from "lucide-react";
import "./adminPage.css";

const url =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const deleteIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-trash3"
    viewBox="0 0 16 16"
  >
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
  </svg>
);

const editIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-pencil-square"
    viewBox="0 0 16 16"
  >
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
    <path
      fill-rule="evenodd"
      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
    />
  </svg>
);

const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return {};
    case "setRow":
      return { ...action.details };
    case "edit":
      return { ...state, [action.key]: action.value };
    default:
      return {};
  }
};

const AdminPage = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [deletingProfiles, setDeletingProfiles] = useState([]);

  const [allAdmins, setAllAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [currentPageAdmins, setCurrentPageAdmins] = useState([]);

  const [editingAdmin, dispatchAction] = useReducer(reducer, {});

  const inputRef = useRef();

  const fetchAdmins = async () => {
    const response = await fetch(url);
    const users = await response.json();
    setAllAdmins(users);
    setFilteredAdmins(users);
    // selectingCurrentPagesRecords()
  };
  const headings =
    currentPageAdmins.length > 0
      ? Object.keys(currentPageAdmins[0]).filter((key) => key !== "originalId")
      : [];

  const pages = Math.ceil(filteredAdmins.length / 10);
  const numwisePages = React.useCallback(() => {
    let pages2 = [];
    for (let i = 0; i < pages; i++) {
      pages2.push(i + 1);
    }
    return pages2;
  }, [pages])();

  const selectingCurrentPagesRecords = () => {
    const ten = currentPage * 10;
    let emptyArry = [];
    let index = 1;
    for (let i = ten - 10; i < ten; i++) {
      if (i < filteredAdmins.length) {
        let newObj = {
          ...filteredAdmins[i],
          id: index,
          originalId: filteredAdmins[i].id,
        };
        emptyArry.push(newObj);
        index += 1;
      }
    }
    setCurrentPageAdmins(emptyArry);
    emptyArry = [];
  };

  const searchWithString = () => {
    if (!searchString) {
      // alert("Please enter text");
      // inputRef.current.focus();
    }

    const filterObjectsWithStr = allAdmins.filter((rec) => {
      const vls = Object.values(rec);
      return vls.some((string1) => String(string1).includes(searchString));
      // [...Object.values(rec)].includes(str)
    });

    setFilteredAdmins(filterObjectsWithStr);
  };

  const searchInputChange = (e) => {
    const str = e.target.value;
    setSearchString(str);
  };
  const setChangedDetialsInAllAdmins = ()=>{
    const updatedAdmins = allAdmins.map((admin)=>{
        if (admin.id===editingAdmin.originalId){
            let editedAdmin = {...editingAdmin};
            editedAdmin["id"]=editingAdmin.originalId
            delete editedAdmin.originalId;
            return editedAdmin;
        }
        return admin;
    })
    setAllAdmins(updatedAdmins)
  }
  const deletingProfilesFun = (profile) => {
    const filterRemainingProfiles = allAdmins.filter(
      (admin) =>
        admin["email"] + admin["name"] !== profile["email"] + profile["name"]
    );
    setAllAdmins(filterRemainingProfiles);
  };

  const addDeletingProfile = (rec) => {
    const alreadyHasProfile = deletingProfiles.includes(rec);
    if (!alreadyHasProfile) {
      setDeletingProfiles([...deletingProfiles, rec]);
    } else {
      setDeletingProfiles(
        deletingProfiles.filter((singleRec) => singleRec !== rec)
      );
    }
  };

  const handleDeleteClick = () => {
    const deleteMails = deletingProfiles.map(
      (rec) => rec["email"] + rec["name"]
    );
    const filterRemainingProfiles = allAdmins.filter(
      (admin) => !deleteMails.includes(admin["email"] + admin["name"])
    );
    setAllAdmins(filterRemainingProfiles);
    setDeletingProfiles([]);
  };

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    selectingCurrentPagesRecords();
  }, [filteredAdmins, currentPage]);

  useEffect(() => {
    if (allAdmins.length) {
      searchWithString();
    }
  }, [allAdmins]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="">
      {allAdmins.length > 0 ? (
        <div>
          <div className="search-container">
            <input
              className="search-button search-field"
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.keyCode === 8 || e.keyCode === 46) {
                  // selectingCurrentPagesRecords();
                }
              }}
              value={searchString}
              onChange={searchInputChange}
              placeholder="Search by name, email or role"
            />
            <button className="search-icon" onClick={searchWithString}>
              {" "}
              <Search size={20} />
            </button>
          </div>
          {filteredAdmins.length > 0 ? (
            <>
              <table width={"100%"} gap={"10"}>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      //  checked={true}
                      //  onClick={() => addDeletingProfile(admin)}
                    />
                  </th>
                  {headings.map((heading) => (
                    <th key={heading} align="start">
                      {heading.toUpperCase()}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
                {currentPageAdmins.map((admin) => (
                  <tr key={JSON.stringify(admin)} style={{ height: "30px", backgroundColor:deletingProfiles.includes(admin)?"grey": "transparent",color:deletingProfiles.includes(admin)?"white":"black" }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={deletingProfiles.includes(admin)}
                        onClick={() => addDeletingProfile(admin)}
                      />
                    </td>
                    {headings.map((value, ix) => (
                      <td key={ix} align="start">
                        {admin.originalId === editingAdmin.originalId &&
                        value !== "id" ? (
                          <input onBlur={setChangedDetialsInAllAdmins} onChange={(e)=>dispatchAction({type:"edit",key:value,value:e.target.value})} value={editingAdmin[value]} />
                        ) : (
                          admin[value]
                        )}
                      </td>
                    ))}
                    <td>
                      <span
                        title="edit"
                        style={{ marginRight: 8, cursor: "pointer" }}
                        onClick={() =>{
                            setChangedDetialsInAllAdmins();
                            dispatchAction({ type: "setRow", details: admin });
                            if(editingAdmin.originalId===admin.originalId){
                                dispatchAction({type:"reset"});
                            }
                        }
                        }
                      >
                        {editIcon}
                      </span>
                      <span
                        title="delete"
                        style={{ cursor: "pointer" }}
                        onClick={() => deletingProfilesFun(admin)}
                      >
                        {deleteIcon}
                      </span>
                    </td>
                  </tr>
                ))}
              </table>
              <div className="footer-container">
                <button
                  onClick={handleDeleteClick}
                  disabled={!!(deletingProfiles.length === 0)}
                  className="delete-button"
                >
                  Delete Selected
                </button>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <button
                    className="previous-button page-button"
                    disabled={currentPage < 2}
                    onClick={previousPage}
                  >
                    <ChevronLeft size={12} />
                  </button>
                  {numwisePages.map((page) => (
                    <button
                      className={`page-button ${
                        currentPage === page ? "current-page" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="next-button page-button"
                    disabled={currentPage === pages}
                    onClick={nextPage}
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p>No data found</p>
          )}
        </div>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};

export default AdminPage;

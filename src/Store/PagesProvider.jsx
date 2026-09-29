import { createContext, useState } from "react";

export const PagesContext = createContext();

export const PagesProvider = ({ children }) => {
  const [Banner, setBanner] = useState({});
  const [VisiMisi, setVisiMisi] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toggleConfig, setToggleConfig] = useState(null);

  const [ParagrafAbout, setParagrafAbout] = useState({});
  const [Result, setResult] = useState([]);
  const [Power, setPower] = useState({});

  const [Faq, setFaq] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State untuk mengontrol sidebar
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  // Current page info for breadcrumb and header
  const [currentPage, setCurrentPage] = useState({ title: "Home", description: "" });

  return (
    <PagesContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedData,
        setSelectedData,
        ParagrafAbout,
        setParagrafAbout,
        Power,
        setPower,
        Faq,
        setFaq,
        VisiMisi,
        setVisiMisi,
        Banner,
        setBanner,
        isSidebarOpen,
        setIsSidebarOpen,
        Result,
        setResult,
        showConfirmModal, setShowConfirmModal,
        selectedItem, setSelectedItem,
        toggleConfig,setToggleConfig,
        // Breadcrumb / current page
        currentPage, setCurrentPage
      }}
    >
      {children}
    </PagesContext.Provider>
  );
};

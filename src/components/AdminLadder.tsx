import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Pagination,
} from "@nextui-org/react";
import { ConfirmationModal } from "../components/confirmation";
import { DndProvider, useDrag, useDrop, DragPreviewImage } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface LadderItem {
  _id: string;
  pos: number;
  name: string;
}
const type = "PLAYER";
interface DraggedItem {
  index: number;
}

const DraggablePlayerRow = ({ item, index, movePlayer }) => {
  const [, ref] = useDrag({
    type,
    item: { index },
  });
  const [, drop] = useDrop({
    accept: type,
    hover: (draggedItem: DraggedItem) => {
      if (draggedItem.index !== index) {
        movePlayer(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });
  return (
    <tr ref={(node) => ref(drop(node))}>
      <td className="p-2">{item.pos}</td>
      <td className="p-2">{item.name}</td>
    </tr>
  );
};
export default function AdminLadder() {
  const [rows, setRows] = useState<LadderItem[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateSuccessModal, setUpdateSuccessModal] = useState(false);

  const confirmModal1 = useDisclosure();
  const confirmModal2 = useDisclosure();
  const confirmModal3 = useDisclosure();
  const confirmModal4 = useDisclosure();
  const confirmModal5 = useDisclosure();
  const confirmModal6 = useDisclosure();
  const confirmModal7 = useDisclosure();
  const confirmModal8 = useDisclosure();
  const updateModal1 = useDisclosure();
  const updateModal2 = useDisclosure();

  useEffect(() => {
    fetch("/api/ladder")
      .then((response) => response.json())
      .then((data) => setRows(data));
  }, []);

  const pages = useMemo(
    () => Math.ceil(rows.length / rowsPerPage),
    [rows.length, rowsPerPage]
  );
  const movePlayer = (fromIndex, toIndex) => {
    const updatedRows = [...rows];
    const [movedPlayer] = updatedRows.splice(fromIndex, 1);
    updatedRows.splice(toIndex, 0, movedPlayer);
    const updatedPosRows = updatedRows.map((item, index) => ({
      ...item,
      pos: index + 1,
    }));
    setRows(updatedPosRows); 
  };

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return rows.slice(start, end);
  }, [page, rows, rowsPerPage]);

  const handleAddPlayer = () => {
    if (!newPlayerName) return;

    const newPlayer = {
      _id: Math.random().toString(),
      pos: rows.length + 1,
      name: newPlayerName,
    };
    setRows([...rows, newPlayer]);
    setNewPlayerName("");
    onClose();
  };
  const handleUpdateDatabase = async () => {
    try {
      const response = await fetch("/api/updateLadder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rows),
      });

      if (!response.ok) {
        throw new Error("Failed to update database");
      }

      const result = await response.json();
      console.log(result);
      setUpdateSuccessModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlayer = (id: string) => {
    setRows(rows.filter((row) => row._id !== id));
  };

  const handleMove = (index: number, direction: number) => {
    let updatedRows = [...rows];
    const [movedItem] = updatedRows.splice(index, 1);
    updatedRows.splice(index + direction, 0, movedItem);
    updatedRows = updatedRows.map((item, index) => ({
      ...item,
      pos: index + 1,
    }));
    setRows(updatedRows);
  };

  const handleRandomize = () => {
    const randomizedRows = [...rows].sort(() => Math.random() - 0.5);
    setRows(randomizedRows.map((item, index) => ({ ...item, pos: index + 1 })));
  };
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const [reorderedItem] = rows.splice(result.source.index, 1);
    rows.splice(result.destination.index, 0, reorderedItem);
    setRows([...rows]);
  };
  return (
    <div className="container mx-auto p-6 md:p-12 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5 w-full md:w-auto">
          <Button onClick={onOpen} color="primary" fullWidth>
            Add Player
          </Button>
          <Button
            onClick={confirmModal1.onOpen}
            variant="shadow"
            color="danger"
            fullWidth
          >
            Randomize Table
          </Button>
          <Button onClick={updateModal1.onOpen} color="secondary" fullWidth>
            Save Changes
          </Button>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        <table>
          <thead>
            <tr>
              <th>POSITION</th>
              <th>NAME</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <DraggablePlayerRow
                key={item._id}
                index={index}
                item={item}
                movePlayer={movePlayer}
              />
            ))}
          </tbody>
        </table>
      </DndProvider>

      <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add a new player
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Player Name"
                variant="underlined"
                value={newPlayerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPlayerName(e.target.value)
                }
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleAddPlayer();
                    onClose();
                  }
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleAddPlayer}>
                Add Player
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={updateSuccessModal}
        onOpenChange={() => setUpdateSuccessModal(false)}
        placement="top-center"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">update </ModalHeader>
            <ModalBody>database successfully updated.</ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => setUpdateSuccessModal(false)}
              >
                lets go
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal1.isOpen}
        onClose={confirmModal1.onClose}
        onConfirm={confirmModal2.onOpen}
        message="are you sure you want to randomize the ladder?"
      />
      <ConfirmationModal
        isOpen={confirmModal2.isOpen}
        onClose={confirmModal2.onClose}
        onConfirm={confirmModal3.onOpen}
        message="are you really sure?"
      />
      <ConfirmationModal
        isOpen={confirmModal3.isOpen}
        onClose={confirmModal3.onClose}
        onConfirm={confirmModal4.onOpen}
        message="are you like fosho?"
      />
      <ConfirmationModal
        isOpen={confirmModal4.isOpen}
        onClose={confirmModal4.onClose}
        onConfirm={confirmModal5.onOpen}
        message="really"
      />
      <ConfirmationModal
        isOpen={confirmModal5.isOpen}
        onClose={confirmModal5.onClose}
        onConfirm={confirmModal6.onOpen}
        message="dude"
      />
      <ConfirmationModal
        isOpen={confirmModal6.isOpen}
        onClose={confirmModal6.onClose}
        onConfirm={confirmModal7.onOpen}
        message="come on"
      />
      <ConfirmationModal
        isOpen={confirmModal7.isOpen}
        onClose={confirmModal7.onClose}
        onConfirm={confirmModal8.onOpen}
        message="bro it ain't that serious"
      />
      <ConfirmationModal
        isOpen={confirmModal8.isOpen}
        onClose={confirmModal8.onClose}
        onConfirm={handleRandomize}
        message="fine you won"
      />
      <ConfirmationModal
        isOpen={updateModal1.isOpen}
        onClose={updateModal1.onClose}
        onConfirm={updateModal2.onOpen}
        message="are you sure you want to update the database?"
      />
      <ConfirmationModal
        isOpen={updateModal2.isOpen}
        onClose={updateModal2.onClose}
        onConfirm={handleUpdateDatabase}
        message="last chance"
      />
    </div>
  );
}
const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #ddd",
};

const getRowStyle = (style, isDragging) => ({
  ...style,
  padding: "8px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  backgroundColor: isDragging ? "lightgreen" : "white",
  boxShadow: isDragging ? "0 2px 10px rgba(0,0,0,0.3)" : "none",
  cursor: isDragging ? "grabbing" : "pointer",
});

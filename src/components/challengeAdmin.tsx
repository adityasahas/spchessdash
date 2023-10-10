// pages/ChallengeManager.tsx
import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  CardFooter,
  useDisclosure,
  Input,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import { DeleteIcon } from "./icons/deleteIcon";
import { EditIcon } from "./icons/editIcon";
interface Match {
  _id: string;
  player1: string;
  player2: string;
  matchTime: string;
  visibility: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load");
  }
  const result = await res.json();
  return result.data;
};

const ChallengeManager: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [visibility, setVisibility] = useState(false);
  const { data: matches, error } = useSWR<Match[]>(
    "/api/matches/matches",
    fetcher
  );
  console.log(matches);
  const [editMatchData, setEditMatchData] = useState<Match | null>(null);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();

  const editMatch = (match: Match) => {
    setEditMatchData(match);
    onEditOpen();
  };

  const updateMatch = async () => {
    if (editMatchData) {
      await fetch("/api/matches/updateMatch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editMatchData),
      });
      onEditOpenChange();
      mutate("/api/matches/matches");
    }
  };
  const addMatch = async () => {
    const newMatch = {
      player1,
      player2,
      matchTime,
      visibility: visibility ? "public" : "private",
    };
    await fetch("/api/matches/addMatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMatch),
    });
    mutate("/api/matches");
    onOpenChange();
  };
  const deleteMatch = async (matchId: string) => {
    await fetch("/api/matches/deleteMatch", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: matchId }),
    });
    mutate("/api/matches/matches");
  };
  const toggleVisibility = async () => {
    const newVisibility = !visibility;
    await fetch("/api/matches/matchesToggle", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visibility: newVisibility ? "public" : "private",
      }),
    });
    setVisibility(newVisibility);
    mutate("/api/matches");
  };

  return (
    <div>
      <div className="flex items-center justify-center mx-auto">
        <Button
          className="md:mr-5"
          onClick={onOpen}
          color="success"
          variant="shadow"
        >
          Add Challenge Match
        </Button>
        <Button
          className="md:ml-5"
          onClick={toggleVisibility}
          color="secondary"
          variant="shadow"
        >
          {visibility ? "Set Matches Private" : "Set Matches Public"}
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Challenge Match</ModalHeader>
              <ModalBody>
                <Input
                  value={player1}
                  onChange={(e) => setPlayer1(e.target.value)}
                  label="Player 1"
                  variant="underlined"
                />
                <Input
                  value={player2}
                  onChange={(e) => setPlayer2(e.target.value)}
                  label="Player 2"
                  variant="underlined"
                />
                <Input
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                  label="Match Time"
                  variant="underlined"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={addMatch}>
                  Add Match
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Challenge Match</ModalHeader>
              <ModalBody>
                <Input
                  value={editMatchData ? editMatchData.player1 : ""}
                  onChange={(e) =>
                    setEditMatchData((prev) =>
                      prev ? { ...prev, player1: e.target.value } : null
                    )
                  }
                  label="Player 1"
                  variant="underlined"
                />
                <Input
                  value={editMatchData ? editMatchData.player2 : ""}
                  onChange={(e) =>
                    setEditMatchData((prev) =>
                      prev ? { ...prev, player2: e.target.value } : null
                    )
                  }
                  label="Player 2"
                  variant="underlined"
                />
                <Input
                  value={editMatchData ? editMatchData.matchTime : ""}
                  onChange={(e) =>
                    setEditMatchData((prev) =>
                      prev ? { ...prev, matchTime: e.target.value } : null
                    )
                  }
                  label="Match Time"
                  variant="underlined"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={updateMatch}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="matches flex flex-wrap -m-2 mt-16">
        {error ? (
          <div>Error loading matches.</div>
        ) : !matches ? (
          <div>Loading...</div>
        ) : Array.isArray(matches) ? (
          matches.map((match) => (
            <div key={match._id} className="p-2 flex-1 min-w-1/3">
              <Card>
                <CardHeader>
                  Match between {match.player1} and {match.player2}
                </CardHeader>
                <CardBody>Scheduled at: {match.matchTime}</CardBody>
                <CardBody>Visibility: {match.visibility}</CardBody>
                <CardFooter>
                  <div className="flex justify-end">
                    <Button
                      color="danger"
                      isIconOnly
                      onClick={() => deleteMatch(match._id)}
                      variant="light"
                    >
                      <DeleteIcon />
                    </Button>
                    <Button
                      className="ml-2"
                      color="warning"
                      variant="light"
                      isIconOnly
                      onClick={() => editMatch(match)}
                    >
                      <EditIcon />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))
        ) : (
          <div>Received unexpected data format</div>
        )}
      </div>
    </div>
  );
};

export default ChallengeManager;

import React, { useEffect, useState } from "react";
import { useSession, getSession, signOut } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Checkbox,
  Button,
  Chip,
  Divider,
  useDisclosure,
  Code,
  Kbd,
} from "@nextui-org/react";
import AdminLadder from "../components/AdminLadder";
import { Layout } from "../components/layout/layout";
import LoadingComponent from "../components/loading";

const TournamentRegistrations: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
    } else {
      const fetchUserType = async () => {
        const email = (session.user as { email: string }).email;
        if (email) {
          const response = await fetch(
            `/api/db?email=${encodeURIComponent(email)}`
          );
          const data = await response.json();
          setUserType(data.userType);
        }
      };

      fetchUserType();
    }
  }, [session]);

  if (loading || userType === null) return <LoadingComponent />;

  if (userType !== "admin")
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center lowercase">
        <p>You do not have admin privileges.</p>
        <p>Contact Adi to get access (give him your email).</p>
        <Button
          className="mt-4"
          color="danger"
          onClick={() => signOut()}
          variant="light"
        >
          Log Out
        </Button>
      </div>
    );

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center my-4">
          <h1 className="text-4xl md:mr-4 mb-4 md:mb-0 font-bold">
            edit the ladder.
          </h1>
          <div className="flex flex-col items-center md:mr-4 mt-4 mb-4 md:mb-0">
            <Kbd keys={["command"]}>+ R</Kbd>
            <span className="text-xs mt-1">to logout</span>
          </div>
        </div>
        <AdminLadder />
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}

export default TournamentRegistrations;

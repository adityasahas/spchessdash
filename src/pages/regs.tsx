import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Layout } from "../components/layout/layout";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Kbd,
  Chip,
  Code,
  Checkbox,
  useDisclosure,
  Link,Progress
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { ConfirmationModal } from "@/components/confirmation";
const RegAdmin = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [userType, setUserType] = useState(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const confirmModal1 = useDisclosure();
  const confirmModal2 = useDisclosure();
  const confirmModal3 = useDisclosure();
  const confirmModal4 = useDisclosure();
  const confirmModal5 = useDisclosure();
  const confirmModal6 = useDisclosure();
  const confirmModal7 = useDisclosure();
  const confirmModal8 = useDisclosure();
  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const res = await fetch("/api/fetchTournamentReg");
        const data = await res.json();
        console.log("Data from API:", data);

        setRegistrations(data);
      };
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
      fetchData();
      fetchUserType();
    }
  }, [session]);

  const handleFinalConfirmation = async () => {
    await fetch("/api/fetchTournamentReg", { method: "DELETE" });
    setRegistrations([]);
  };

  if (loading || userType === null)
    return (
        <Progress isIndeterminate className="flex flex-center items-center mx-auto" size="lg" />
    );

  if (userType !== "admin")
    return (
      <>
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
      </>
    );

  return (
    <Layout>
      <div className="container mx-auto px-4 mt-24">
        <div className="flex flex-col items-center my-4">
          <h1 className="text-4xl mb-4 font-bold text-center w-full">
            view registrations.
          </h1>
          <Link
            className="underline mb-4"
            href="https://spchess.org/tournament"
            color="primary"
          >
            registration link
          </Link>
          <div className="flex flex-col items-center mt-4 mb-4 w-full">
            <Kbd keys={["command"]}>+ R</Kbd>
            <span className="text-xs mt-1">to logout</span>
          </div>
          <Button
            fullWidth
            className="mt-4 mb-4 flex flex-col items-center w-full"
            variant="light"
            color="danger"
            size="md"
            onClick={handleFinalConfirmation}
          >
            clear regs
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registrations.map((registration, index) => (
            <div key={index} className="w-1/2 p-2">
              <Card className="max-w-[400px] mx-auto">
                <CardHeader className="flex gap-3">
                  <p className="text-md">{registration.name}</p>
                  <Chip color="primary" variant="shadow">
                    {registration.rating}
                  </Chip>
                </CardHeader>
                <CardBody>
                  <p>
                    email: <Code>{registration.email}</Code>
                  </p>
                  <p>
                    chess.com username:{" "}
                    <Code>{registration.chessUsername}</Code>
                  </p>
                </CardBody>
                <CardFooter className="flex justify-center">
                  <Checkbox />
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
       
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

export default RegAdmin;

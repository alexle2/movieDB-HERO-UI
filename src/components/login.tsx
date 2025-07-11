import API from "@/API";
import { initUserData, UserContext } from "@/context";
import {
  Form,
  Input,
  Button,
  Alert,
  ModalContent,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useContext, useState } from "react";

type LoginData = {
  password: string;
  username: string;
};

export const Login = () => {
  const { isAuth, setUser, setCookie, removeCookie }: any =
    useContext(UserContext);
  const [submitings, setSubmitings] = useState(false);
  const [error, setError] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const logOut = () => {
    setUser(initUserData);
    removeCookie("userName");
    removeCookie("sessionId");
    removeCookie("accountId");
  };

  const onSubmit = async (e: any) => {
    setError(false);
    e.preventDefault();
    const { username, password } = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as LoginData;
    setSubmitings(true);
    try {
      const requestToken = await API.getRequestToken();
      const { session_id } = await API.authenticate(
        requestToken,
        username,
        password
      );
      const account = await API.getAccountDetails(session_id);

      setUser({
        sessionId: session_id,
        userName: account.username,
        accountId: account.id,
      });
      setSubmitings(false);
      onClose();
      setCookie("userName", account.username);
      setCookie("sessionId", session_id);
      setCookie("accountId", account.id);
    } catch {
      setError(true);
      setSubmitings(false);
    }
  };
  return (
    <>
      {isAuth && (
        <Button onPress={logOut} color="primary" variant="flat">
          Log Out
        </Button>
      )}
      {!isAuth && (
        <Button onPress={onOpen} color="primary" variant="flat">
          Login
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <section className="flex flex-col items-center justify-center gap-4">
              <Form
                className="w-full max-w-md flex flex-col gap-4"
                onSubmit={onSubmit}
              >
                <ModalHeader className="flex flex-col gap-1">Login</ModalHeader>
                <ModalBody className="w-full">
                  <Input
                    isRequired
                    label="Username"
                    labelPlacement="outside"
                    name="username"
                    placeholder="Enter your username"
                    type="text"
                  />
                  <Input
                    isRequired
                    errorMessage="Please enter a valid password"
                    label="Password"
                    labelPlacement="outside"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                  />
                  {error && (
                    <div className="flex items-center justify-center w-full">
                      <div className="flex flex-col w-full">
                        <div className="w-full flex items-center my-3">
                          <Alert color="danger" title="Error" />
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter className="w-full">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    variant="bordered"
                    isLoading={submitings}
                  >
                    Login
                  </Button>
                </ModalFooter>
              </Form>
            </section>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

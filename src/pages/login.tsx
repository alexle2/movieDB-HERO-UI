import API from "@/API";
import DefaultLayout from "@/layouts/default";
import { Form, Input, Button, Alert } from "@heroui/react";
import { useState } from "react";

type LoginData = {
  password: string;
  username: string;
};

export const Login = () => {
  const [submitings, setSubmitings] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = async (e: any) => {
    setError(false);
    e.preventDefault();
    const { username, password } = Object.fromEntries(new FormData(e.currentTarget)) as LoginData;
    setSubmitings(true);
    try {
      const requestToken = await API.getRequestToken();
      const { session_id } = await API.authenticate(
        requestToken,
        username,
        password
      );
      const account = await API.getAccountDetails(session_id);
    } catch {
      setError(true);
      setSubmitings(false);
    }
  };
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Form
          className="w-full max-w-md flex flex-col gap-4"
          onSubmit={onSubmit}
        >
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
          <Button type="submit" variant="bordered" isLoading={submitings}>
            Login
          </Button>
          {error && (
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col w-full">
                <div className="w-full flex items-center my-3">
                  <Alert color="danger" title="Error" />
                </div>
              </div>
            </div>
          )}
        </Form>
      </section>
    </DefaultLayout>
  );
};

/**
 * Author: Lukáš Plevač
 */
import { useState } from "react";
import { useDispatch } from "react-redux";
import userClient from "../../api/userClient";
import { setNotification } from "../../redux/notifications/notificationActions";
import ButtonForm from "../ButtonForm/ButtonForm";
import InputForm from "../InputForm/InputForm";

const PasswordChangeForm = () => {
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const updatePassword = async (e) => {
    setErrors({ current_password: [], password: [] });
    setIsLoading(true);
    e.preventDefault();
    try {
      await userClient.updatePassword({
        current_password: currentPassword,
        password: password,
        password_confirmation: passwordConfirmation,
      });
      dispatch(
        setNotification({
          message: "Password Changed",
          status: "SUCCESS",
          show: true,
        })
      );
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      setErrors(error.errors[0].response.data.errors);

      dispatch(
        setNotification({
          message: "Something went wrong try again later",
          status: "FAIL",
          show: true,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-5 space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
      <section>
        <form onSubmit={updatePassword}>
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-6 bg-white-no-important dark:bg-neutral-700 sm:p-6 text-neutral-900 dark:text-neutral-200">
              <div>
                <h2 className="text-lg font-medium leading-6">
                  Update Password
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-6 mt-6">
                <InputForm
                  name="current_password"
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  handleValue={setCurrentPassword}
                  wrapperStyle="col-span-4 sm:col-span-12"
                  error={
                    errors && errors.current_password
                      ? errors.current_password[0]
                      : undefined
                  }
                />
                <div className="hidden sm:col-span-2"></div>
                <InputForm
                  name="password"
                  label="new password"
                  type="password"
                  value={password}
                  handleValue={setPassword}
                  wrapperStyle="col-span-4 sm:col-span-12"
                  error={
                    errors && errors.password ? errors.password[0] : undefined
                  }
                />
                <InputForm
                  name="password_confirmation"
                  label="password confirmation"
                  type="password"
                  value={passwordConfirmation}
                  handleValue={setPasswordConfirmation}
                  wrapperStyle="col-span-4 sm:col-span-12"
                />
              </div>
            </div>
            <div className="flex justify-end px-4 py-3 bg-neutral-50 dark:bg-neutral-600 sm:px-6">
              <ButtonForm isLoading={isLoading}>Save</ButtonForm>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default PasswordChangeForm;

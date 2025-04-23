"use client";

import Button from "@/components/common/Button";
import InputBox from "@/components/common/InputBox";
import { hover, transparentForm } from "@/styles/form";
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div
      className={`flex flex-col gap-6 w-full max-w-150 p-4 rounded-2xl ${transparentForm} ${hover}`}
    >
      <Button text="빠른 시작" onClick={() => {}} />
      <InputBox
        label="이메일"
        value={email}
        onChange={emailHandler}
      />
      <InputBox
        label="비밀번호"
        type="password"
        value={password}
        onChange={passwordHandler}
      />
      <Button text="등록 및 시작" border={true} />
    </div>
  );
};

export default Register;

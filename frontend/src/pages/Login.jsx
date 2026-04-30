import { useRef } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useFormAnimation } from "@/hooks/useFormAnimation";
import Marque from "../components/nav/Marque";

export default function Login() {
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  useFormAnimation(pageRef, cardRef, {
    headerClass: ".login-header",
    fieldClass: ".login-field",
    buttonClass: ".login-button",
  });

  return (
    <div ref={pageRef} className="min-h-screen  lg:grid-cols-2">
       <Marque />
      <LoginForm cardRef={cardRef} />
    </div>
  );
}

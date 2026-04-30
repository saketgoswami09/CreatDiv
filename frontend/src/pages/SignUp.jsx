import { useRef } from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import { useFormAnimation } from "@/hooks/useFormAnimation";
import Marque from "../components/nav/Marque";

export default function SignUp() {
  const pageRef = useRef(null);
  const cardRef = useRef(null);

  useFormAnimation(pageRef, cardRef, {
    headerClass: ".signup-header",
    fieldClass: ".signup-field",
    buttonClass: ".signup-button",
  });

  return (
    <div>
       <Marque />
      <SignUpForm cardRef={cardRef} />
     
    </div>
  );
}

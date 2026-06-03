"use client";

import {
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FieldError,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";

type ContactTabId = "project" | "career" | "partner";

type TextFieldName =
  | "name"
  | "email"
  | "company"
  | "phone"
  | "facebook"
  | "behance"
  | "resume"
  | "message"
  | "note";

type ContactFormValues = {
  field: "1" | "2" | "3";
  name: string;
  email: string;
  company?: string;
  phone?: string;
  facebook?: string;
  behance?: string;
  resume?: string;
  message?: string;
  note?: string;
  type?: string[];
  budget?: string;
  attach?: FileList;
};

type TextFieldConfig = {
  name: TextFieldName;
  placeholder: string;
  rules?: RegisterOptions<ContactFormValues, TextFieldName>;
};

type ChoiceOption = {
  id: string;
  label: string;
  value?: string;
};

type ContactTabConfig = {
  id: ContactTabId;
  label: string;
  field: ContactFormValues["field"];
  submitLabel: string;
};

type ContactFormsSectionProps = {
  /**
   * Use your own API route.
   * Example: "/api/contact"
   */
  endpoint?: string;

  /**
   * Optional callback if submission should be handled manually.
   */
  onSubmit?: (
    values: ContactFormValues,
    formData: FormData,
  ) => Promise<void> | void;
};

const tabs: ContactTabConfig[] = [
  {
    id: "project",
    label: "Start a project.",
    field: "1",
    submitLabel: "Send Request",
  },
  {
    id: "career",
    label: "Join our team.",
    field: "2",
    submitLabel: "Submit Profile",
  },
  {
    id: "partner",
    label: "Be a partner.",
    field: "3",
    submitLabel: "Submit Message",
  },
];

const serviceOptions: ChoiceOption[] = [
  {
    id: "mobile-ui",
    label: "Mobile UX/UI Design",
    value: "Mobile UX/UI Design",
  },
  {
    id: "web-ui",
    label: "Web UX/UI Design",
    value: "Web UX/UI Design",
  },
  {
    id: "mobile-development",
    label: "Mobile Development",
    value: "Mobile Development",
  },
  {
    id: "web-development",
    label: "Web Development",
    value: "Web Development",
  },
  {
    id: "illustrations",
    label: "Illustrations",
    value: "Illustrations",
  },
  {
    id: "interaction-design",
    label: "Interaction Design",
    value: "Interaction Design",
  },
];

const budgetOptions: ChoiceOption[] = [
  {
    id: "budget-small",
    label: "less than $5.000",
    value: "less than $5.000",
  },
  {
    id: "budget-medium",
    label: "$5.000 - $20.000",
    value: "$5.000 - $20.000",
  },
  {
    id: "budget-large",
    label: "more than $20.000",
    value: "more than $20.000",
  },
];

const emailPattern = {
  value: /\S+@\S+\.\S+/,
  message: "Your email format does not look correct.",
};

const validateUrl = (value?: string) => {
  if (!value) return true;

  const normalizedValue =
    !value.startsWith("http") && value.includes(".")
      ? `https://${value}`
      : value;

  try {
    new URL(normalizedValue);

    return true;
  } catch {
    return "Your link does not look correct.";
  }
};

const textFieldClassName =
  "peer w-full bg-transparent px-2 py-3 outline-none caret-primary-600 placeholder:text-neutral-300";

const fieldLineClassName =
  "mt-2 border-t border-neutral-300 transition-colors duration-300 peer-focus:border-neutral-800";

const projectFields: TextFieldConfig[] = [
  {
    name: "name",
    placeholder: "Name",
    rules: {
      required: "Please enter your name.",
    },
  },
  {
    name: "email",
    placeholder: "Email",
    rules: {
      required: "Please enter your email.",
      pattern: emailPattern,
    },
  },
  {
    name: "company",
    placeholder: "Company name",
    rules: {
      required: "Please enter your company name.",
    },
  },
];

const careerPersonalFields: TextFieldConfig[] = [
  {
    name: "name",
    placeholder: "Name",
    rules: {
      required: "Please enter your name.",
    },
  },
  {
    name: "email",
    placeholder: "Email",
    rules: {
      required: "Please enter your email.",
      pattern: emailPattern,
    },
  },
  {
    name: "phone",
    placeholder: "Phone number",
    rules: {
      required: "Please enter your phone number.",
    },
  },
  {
    name: "facebook",
    placeholder: "Facebook link",
    rules: {
      required: "Please enter your Facebook link.",
      validate: validateUrl,
    },
  },
];

const careerApplicationFields: TextFieldConfig[] = [
  {
    name: "behance",
    placeholder: "Behance/Dribbble link",
    rules: {
      required: "Please enter your portfolio link.",
      validate: validateUrl,
    },
  },
  {
    name: "resume",
    placeholder: "Portfolio/Resume link",
    rules: {
      validate: validateUrl,
    },
  },
  {
    name: "message",
    placeholder: "Message content",
  },
];

const partnerFields: TextFieldConfig[] = [
  {
    name: "name",
    placeholder: "Name",
    rules: {
      required: "Please enter your name.",
    },
  },
  {
    name: "email",
    placeholder: "Email",
    rules: {
      required: "Please enter your email.",
      pattern: emailPattern,
    },
  },
  {
    name: "phone",
    placeholder: "Phone number",
    rules: {
      required: "Please enter your phone number.",
    },
  },
  {
    name: "message",
    placeholder: "Message content",
    rules: {
      required: "Please enter your message.",
    },
  },
];

const PaperclipIcon = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#181818" />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.864 7.4403C14.2196 6.79594 13.1749 6.79594 12.5305 7.44031L8.28787 11.6829C7.17488 12.7959 7.17488 14.6005 8.28787 15.7135C9.40086 16.8264 11.2054 16.8264 12.3184 15.7135L16.9853 11.0465C17.2782 10.7537 17.753 10.7537 18.0459 11.0465C18.3388 11.3394 18.3388 11.8143 18.0459 12.1072L13.379 16.7741C11.6803 18.4729 8.92599 18.4729 7.22721 16.7741C5.52843 15.0753 5.52843 12.3211 7.22721 10.6223L11.4699 6.37965C12.7 5.14949 14.6945 5.14949 15.9246 6.37964C17.1548 7.6098 17.1548 9.60427 15.9246 10.8344L11.682 15.0771C10.9205 15.8386 9.68579 15.8386 8.92427 15.0771C8.16274 14.3155 8.16274 13.0809 8.92427 12.3193L13.1669 8.0767C13.4598 7.78381 13.9347 7.78381 14.2276 8.0767C14.5205 8.36959 14.5205 8.84447 14.2276 9.13736L9.98493 13.38C9.80919 13.5557 9.80919 13.8407 9.98493 14.0164C10.1607 14.1921 10.4456 14.1921 10.6213 14.0164L14.864 9.77376C15.5083 9.12939 15.5083 8.08467 14.864 7.4403Z"
        fill="white"
      />
    </svg>
  );
};

const CloseIcon = ({ className = "h-6 w-6" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66602 25.3334L25.5222 6.47719"
        stroke="currentColor"
        strokeWidth="2.5"
      />

      <path
        d="M6.66602 6.66663L25.5222 25.5228"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
};

type MagneticProps = {
  children: ReactNode;
  className?: string;
};

const Magnetic = ({ children, className = "" }: MagneticProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    const item = itemRef.current;

    if (!root || !item) return;

    if (!window.matchMedia("(pointer: fine)").matches) return;

    const bounds = root.getBoundingClientRect();

    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;

    gsap.to(item, {
      x: x * 0.18,
      y: y * 0.18,
      duration: 0.3,
      ease: "power3.out",
      force3D: true,
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    const item = itemRef.current;

    if (!item) return;

    gsap.to(item, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1.1, 0.45)",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={rootRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block ${className}`}
    >
      <div ref={itemRef}>{children}</div>
    </div>
  );
};

type SelectablePillProps = {
  label: string;
  value: string;
  type: "checkbox" | "radio";
  name: "type" | "budget";
  register: ReturnType<typeof useForm<ContactFormValues>>["register"];
};

const SelectablePill = ({
  label,
  value,
  type,
  name,
  register,
}: SelectablePillProps) => {
  return (
    <Magnetic>
      <label className="relative z-10 inline-block select-none overflow-hidden rounded-full">
        <input
          {...register(name)}
          hidden
          type={type}
          value={value}
          className="peer fill-input"
        />

        <span className="fill-ripple -z-10 bg-primary-600" />

        <span className="relative z-10 inline-flex rounded-full border border-neutral-800 px-5 py-3 text-tn transition-colors duration-500 peer-checked:border-transparent peer-checked:text-neutral-0 md:px-6 md:py-3.5 md:text-xs lg:px-6 lg:py-4 lg:text-sm xl:px-10 xl:py-5 xl:text-base">
          {label}
        </span>
      </label>
    </Magnetic>
  );
};

type ChoiceListProps = {
  title: string;
  name: "type" | "budget";
  type?: "checkbox" | "radio";
  options: ChoiceOption[];
  register: ReturnType<typeof useForm<ContactFormValues>>["register"];
};

const ChoiceList = ({
  title,
  name,
  type = "checkbox",
  options,
  register,
}: ChoiceListProps) => {
  return (
    <div>
      <div data-contact-animate>{title}</div>

      <div data-contact-animate className="pt-4 lg:pt-6 xl:pt-8">
        <ul className="flex flex-wrap gap-x-3 gap-y-4">
          {options.map((option) => (
            <li key={option.id}>
              <SelectablePill
                type={type}
                name={name}
                label={option.label}
                value={option.value ?? option.id}
                register={register}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

type TextFieldsProps = {
  title?: string;
  fields: TextFieldConfig[];
  register: ReturnType<typeof useForm<ContactFormValues>>["register"];
  errors: Partial<Record<TextFieldName, FieldError>>;
};

const TextFields = ({ title, fields, register, errors }: TextFieldsProps) => {
  return (
    <div>
      {title ? (
        <div data-contact-animate className="mb-4 lg:mb-6 xl:mb-8">
          {title}
        </div>
      ) : null}

      <ul className="space-y-3 md:space-y-4 lg:space-y-6 xl:space-y-8">
        {fields.map((field) => {
          const error = errors[field.name];

          return (
            <li
              key={field.name}
              data-contact-animate
              className={`py-2 ${error ? "text-red-600" : ""}`}
            >
              <input
                {...register(field.name, field.rules)}
                placeholder={`${field.placeholder}${
                  field.rules?.required ? "" : " (optional)"
                }`}
                autoComplete="off"
                autoCorrect="off"
                className={textFieldClassName}
              />

              <div
                className={`${fieldLineClassName} ${
                  error ? "border-red-600" : ""
                }`}
              >
                {error?.message ? (
                  <p className="mt-2 p-2 text-xs font-normal xl:px-4 xl:pt-2 xl:text-base">
                    {String(error.message)}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

type AttachmentFieldProps = {
  register: ReturnType<typeof useForm<ContactFormValues>>["register"];
  setValue: ReturnType<typeof useForm<ContactFormValues>>["setValue"];
  error?: FieldError;
};

const AttachmentField = ({
  register,
  setValue,
  error,
}: AttachmentFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filename, setFilename] = useState("");

  const registeredField = register("attach", {
    validate: (files) => {
      if (!files?.length) return true;

      const firstFile = files[0];

      return (
        firstFile.size < 25 * 1024 * 1024 ||
        "The attachment exceeds the 25 MB limit."
      );
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    registeredField.onChange(event);

    const file = event.target.files?.[0];

    setFilename(file?.name ?? "");
  };

  const removeFile = () => {
    setValue("attach", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setFilename("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div data-contact-animate>
      <div className="flex items-center text-lg">
        <label className="group cursor-pointer">
          <input
            {...registeredField}
            ref={(element) => {
              registeredField.ref(element);
              fileInputRef.current = element;
            }}
            id="contact-attachment"
            type="file"
            hidden
            onChange={handleChange}
          />

          <span className="mr-3 inline-block align-middle font-medium transition-opacity duration-300 group-hover:opacity-80">
            <PaperclipIcon />
          </span>

          <span className="mr-3 break-all">{filename || "Add attachment"}</span>
        </label>

        {filename ? (
          <button
            type="button"
            onClick={removeFile}
            className="inline-flex items-center rounded-full bg-neutral-800 p-2 text-neutral-0 transition-opacity duration-300 hover:opacity-80"
          >
            <CloseIcon className="h-4 w-4 xl:h-6 xl:w-6" />

            <span className="px-2 text-sm">Remove</span>
          </button>
        ) : null}
      </div>

      {error?.message ? (
        <p className="mt-2 pt-2 text-tn font-normal text-red-600 xl:text-sm">
          {String(error.message)}
        </p>
      ) : (
        <p className="mt-2 pt-2 text-tn font-normal xl:text-sm">
          (a brief, wireframe, branding guideline, old design, ...)
        </p>
      )}
    </div>
  );
};

const createFormData = (tab: ContactTabConfig, values: ContactFormValues) => {
  const data = new FormData();

  data.append("field", tab.field);
  data.append("dataname", values.name.trim());

  if (tab.id === "project") {
    data.append("phanloai", "Start a project");
    data.append("email", values.email ?? "");
    data.append("company", values.company ?? "");
    data.append("budget", values.budget ?? "");
    data.append("note", values.note ?? "");
    data.append("type", values.type?.join(", ") ?? "");

    const attachment = values.attach?.[0];

    if (attachment) {
      data.append("file", attachment);
    }
  }

  if (tab.id === "career") {
    data.append("phanloai", "Join our team");
    data.append("email", values.email ?? "");
    data.append("phone", values.phone ?? "");
    data.append("facebook", values.facebook ?? "");
    data.append("behance", values.behance ?? "");
    data.append("resume", values.resume ?? "");
    data.append("message", values.message ?? "");
  }

  if (tab.id === "partner") {
    data.append("phanloai", "Be a partner");
    data.append("email", values.email ?? "");
    data.append("phone", values.phone ?? "");
    data.append("message", values.message ?? "");
  }

  return data;
};

type DynamicFormProps = {
  tab: ContactTabConfig;
  endpoint: string;
  onSubmit?: ContactFormsSectionProps["onSubmit"];
  onSuccess: (name: string) => void;
};

const DynamicForm = ({
  tab,
  endpoint,
  onSubmit,
  onSuccess,
}: DynamicFormProps) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      field: tab.field,
      type: [],
    },
  });

  useLayoutEffect(() => {
    const form = formRef.current;

    if (!form) return;

    const items = form.querySelectorAll<HTMLElement>("[data-contact-animate]");

    gsap.fromTo(
      items,
      {
        opacity: 0,
        y: 64,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
  }, [tab.id]);

  const submitForm: SubmitHandler<ContactFormValues> = async (values) => {
    const formData = createFormData(tab, values);

    if (onSubmit) {
      await onSubmit(values, formData);
    } else {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to submit the form. Please try again.");
      }
    }

    const firstName = values.name.trim().split(/\s+/).slice(-2).join(" ");

    onSuccess(firstName);
    reset();
  };

  return (
    <form
      ref={formRef}
      id={tab.field}
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6 md:space-y-8 xl:w-[59.375rem] xl:space-y-14"
    >
      <input {...register("field")} type="hidden" value={tab.field} />

      {tab.id === "project" ? (
        <>
          <ChoiceList
            title="You need to do"
            name="type"
            options={serviceOptions}
            register={register}
          />

          <TextFields
            fields={projectFields}
            register={register}
            errors={errors}
          />

          <ChoiceList
            title="Your budget"
            name="budget"
            type="radio"
            options={budgetOptions}
            register={register}
          />

          <TextFields
            fields={[
              {
                name: "note",
                placeholder: "Tell more about your request",
              },
            ]}
            register={register}
            errors={errors}
          />

          <AttachmentField
            register={register}
            setValue={setValue}
            error={errors.attach}
          />
        </>
      ) : null}

      {tab.id === "career" ? (
        <>
          <TextFields
            title="Personal information"
            fields={careerPersonalFields}
            register={register}
            errors={errors}
          />

          <TextFields
            title="Application information"
            fields={careerApplicationFields}
            register={register}
            errors={errors}
          />
        </>
      ) : null}

      {tab.id === "partner" ? (
        <TextFields
          title="Partner information"
          fields={partnerFields}
          register={register}
          errors={errors}
        />
      ) : null}

      <div data-contact-animate>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-neutral-800 px-6 py-3 text-xs font-medium text-neutral-0 transition-all duration-200 hover:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:px-7 md:py-4 md:text-sm xl:px-9 xl:py-5 xl:text-base"
        >
          {isSubmitting ? "Sending..." : tab.submitLabel}
        </button>
      </div>
    </form>
  );
};

type ThankYouModalProps = {
  name: string;
  show: boolean;
  onClose: () => void;
};

const ThankYouModal = ({ name, show, onClose }: ThankYouModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const modal = modalRef.current;

    if (!modal || !show) return;

    gsap.fromTo(
      modal,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      },
    );
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] grid place-items-center bg-neutral-0 px-6"
    >
      <button
        type="button"
        aria-label="Close success message"
        onClick={onClose}
        className="absolute inset-0 hidden cursor-pointer xl:block"
        data-cursor-variant="close"
        data-cursor-theme="dark"
      />

      <div className="relative z-10 mx-auto w-full max-w-[37.5rem] text-left font-medium xl:max-w-[50rem]">
        <div className="text-h8 md:text-h7 xl:text-h5">
          <p>
            Thank you,{" "}
            <span className="capitalize text-primary-600">{name}</span>.
          </p>

          <p>
            We received the
            <br />
            message from you.
          </p>
        </div>

        <p className="mt-4 text-xs md:text-base xl:mt-8 xl:text-lg">
          We will contact you as soon as possible.
        </p>

        <div className="mt-12 text-right md:mt-10 md:text-left lg:mt-12 xl:hidden">
          <button
            type="button"
            onClick={onClose}
            className="inline-grid h-14 w-14 place-items-center rounded-full bg-neutral-800 text-neutral-0 transition-transform duration-200 hover:scale-95 md:h-16 md:w-16"
          >
            <CloseIcon className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ContactFormsSection = ({
  endpoint = "/api/contact",
  onSubmit,
}: ContactFormsSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const panelWrapperRef = useRef<HTMLDivElement | null>(null);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [successName, setSuccessName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const activeTab = useMemo(() => {
    return tabs[activeTabIndex];
  }, [activeTabIndex]);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash === "#join-our-team") {
      const timeout = window.setTimeout(() => {
        setActiveTabIndex(1);

        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);

      return () => window.clearTimeout(timeout);
    }
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tabItems = tabsRef.current?.children ?? [];

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });

      timeline
        .fromTo(
          contentRef.current,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.1,
          },
        )
        .fromTo(
          ".contact-form-kicker",
          {
            opacity: 0,
            yPercent: 100,
            rotateX: -40,
            transformPerspective: 600,
          },
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.75,
            ease: "power3.out",
          },
        )
        .fromTo(
          tabItems,
          {
            opacity: 0,
            yPercent: 100,
            rotateX: -40,
            transformPerspective: 600,
          },
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            stagger: 0.2,
            duration: 0.75,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .fromTo(
          underlineRef.current,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 0.4,
            ease: "power3.out",
          },
          "-=0.25",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const changeTab = (nextIndex: number) => {
    if (nextIndex === activeTabIndex) return;

    const panel = panelWrapperRef.current;

    if (!panel) {
      setActiveTabIndex(nextIndex);

      return;
    }

    gsap.to(panel, {
      opacity: 0,
      y: -24,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        setActiveTabIndex(nextIndex);

        gsap.fromTo(
          panel,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
          },
        );
      },
    });
  };

  const handleSuccess = (name: string) => {
    setSuccessName(name);
    setShowSuccess(true);

    document.body.style.overflow = "hidden";
  };

  const closeSuccess = () => {
    setShowSuccess(false);

    document.body.style.overflow = "";
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="theme__light bg-neutral-0 text-neutral-800"
        data-cursor-theme="dark"
        data-cursor-stretch="true"
      >
        <div ref={contentRef} className="container invisible py-12 xl:py-28">
          <div className="text-sm font-medium lg:text-base xl:text-lg">
            <div>
              <div className="contact-form-kicker inline-block">
                You want to
              </div>

              <div
                ref={tabsRef}
                className="-mr-6 flex space-x-14 overflow-auto whitespace-nowrap py-4 text-lg font-medium text-neutral-800 scrollbar-hide md:py-6 lg:space-x-20 lg:text-h8 xl:space-x-28 xl:py-8 xl:text-h6"
              >
                {tabs.map((tab, index) => {
                  const isActive = activeTabIndex === index;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => changeTab(index)}
                      className={`cursor-pointer transition-opacity duration-500 ${
                        isActive ? "opacity-100" : "opacity-[0.15]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div ref={underlineRef} className="h-px w-full bg-neutral-800" />
            </div>

            <div
              ref={panelWrapperRef}
              className="mt-6 md:mt-8 lg:mt-12 xl:mt-[4.5rem]"
            >
              <DynamicForm
                key={activeTab.id}
                tab={activeTab}
                endpoint={endpoint}
                onSubmit={onSubmit}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      </section>

      <ThankYouModal
        name={successName}
        show={showSuccess}
        onClose={closeSuccess}
      />
    </>
  );
};

export default ContactFormsSection;

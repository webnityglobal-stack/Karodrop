import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Box,
  Building2,
  ClipboardCheck,
  Clock3,
  Factory,
  Globe2,
  Package,
  Palette,
  Rocket,
  ShoppingBag,
  Store,
  Truck,
  Users,
} from "lucide-react";

const NAVBAR_HEIGHT = 80;

/* =========================================================
   HASH SCROLL
========================================================= */

const scrollToHash = (hash) => {
  if (!hash) return;

  const id = hash.replace("#", "");
  const element = document.getElementById(id);

  if (!element) return;

  const y =
    element.getBoundingClientRect().top +
    window.pageYOffset -
    NAVBAR_HEIGHT -
    12;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
};

const SectionLink = ({ href, label }) => {
  return (
    <a
      href={href}
      className="
        inline-flex
        shrink-0
        items-center
        rounded-full
        px-4
        py-2
        text-sm
        font-semibold
        text-[#16345F]
        transition
        hover:bg-[#EAF3FF]
        hover:text-[#0878F9]
      "
    >
      {label}
    </a>
  );
};

/* =========================================================
   INFO SECTION
========================================================= */

const InfoSection = ({
  id,
  eyebrow,
  title,
  description,
  points = [],
  buttonText,
  buttonHref = "#",
  icon: Icon = Box,
  reverse = false,
  children,
}) => {
  return (
    <section
      id={id}
      className="
        w-full
        scroll-mt-[92px]
        border-t
        border-[#DCE7F2]
        bg-[#F5FAFF]
      "
    >
      <div
        className={`
          mx-auto
          grid
          w-full
          max-w-7xl
          items-center
          gap-10
          px-5
          py-14
          sm:px-6
          md:py-16
          lg:grid-cols-2
          lg:gap-14
          lg:px-10
          xl:gap-20
        `}
      >
        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className={`
            min-w-0
            ${reverse ? "lg:order-2" : "lg:order-1"}
          `}
        >
          {eyebrow && (
            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#D8E7F7]
                bg-white
                px-4
                py-2
                text-sm
                font-semibold
                text-[#0878F9]
                shadow-[0_4px_16px_rgba(11,31,58,0.04)]
              "
            >
              <Icon size={17} strokeWidth={2} />
              <span>{eyebrow}</span>
            </div>
          )}

          <h2
            className="
              max-w-[680px]
              text-[34px]
              font-extrabold
              leading-[1.08]
              tracking-[-0.03em]
              text-[#0A2A6B]
              sm:text-[40px]
              md:text-[46px]
              lg:text-[48px]
              xl:text-[52px]
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-6
              max-w-[680px]
              text-[17px]
              leading-8
              text-[#55708F]
              md:text-[18px]
            "
          >
            {description}
          </p>

          {points.length > 0 && (
            <div className="mt-7 space-y-3.5">
              {points.map((point, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-start
                    gap-3
                    text-[16px]
                    font-semibold
                    leading-7
                    text-[#0B1F3A]
                  "
                >
                  <CheckCircle2
                    className="
                      mt-[3px]
                      shrink-0
                      text-[#0878F9]
                    "
                    size={22}
                    strokeWidth={2}
                  />

                  <span>{point}</span>
                </div>
              ))}
            </div>
          )}

          {buttonText && (
            <div className="mt-8">
              <Link
                to={buttonHref}
                className="
                  inline-flex
                  min-h-[50px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#0878F9]
                  px-6
                  py-3
                  text-[15px]
                  font-bold
                  text-white
                  shadow-[0_10px_24px_rgba(8,120,249,0.20)]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#006CEB]
                  hover:shadow-[0_14px_30px_rgba(8,120,249,0.25)]
                "
              >
                {buttonText}
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>

        {/* =================================================
            VISUAL
        ================================================= */}

        <div
          className={`
            flex
            w-full
            min-w-0
            ${reverse ? "lg:order-1 lg:justify-start" : "lg:order-2 lg:justify-end"}
          `}
        >
          <div
            className="
              w-full
              max-w-[590px]
              rounded-[28px]
              border
              border-[#D9E7F5]
              bg-white
              p-4
              shadow-[0_18px_45px_rgba(11,31,58,0.08)]
              sm:p-5
              md:rounded-[30px]
            "
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   VISUAL CARD
========================================================= */

const FeatureVisual = ({
  icon: Icon = Box,
  label = "KARODROP",
  title,
  description,
  items = [],
}) => {
  return (
    <div
      className="
        w-full
        rounded-[22px]
        bg-[#EAF4FF]
        p-5
        sm:p-7
        md:p-8
      "
    >
      <div
        className="
          flex
          h-[82px]
          w-[82px]
          items-center
          justify-center
          rounded-[22px]
          bg-[#0878F9]
          text-white
          shadow-[0_12px_25px_rgba(8,120,249,0.18)]
        "
      >
        <Icon size={38} strokeWidth={1.8} />
      </div>

      <div className="mt-6">
        <p
          className="
            text-sm
            font-bold
            uppercase
            tracking-wide
            text-[#0878F9]
          "
        >
          {label}
        </p>

        <h3
          className="
            mt-2
            text-[28px]
            font-extrabold
            leading-tight
            tracking-[-0.02em]
            text-[#0A2A6B]
            sm:text-[32px]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-4
            text-[16px]
            leading-7
            text-[#55708F]
          "
        >
          {description}
        </p>
      </div>

      {items.length > 0 && (
        <div
          className="
            mt-7
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
          "
        >
          {items.map((item, index) => {
            const ItemIcon = item.icon || Package;

            return (
              <div
                key={index}
                className="
                  flex
                  min-h-[82px]
                  items-center
                  gap-3
                  rounded-2xl
                  bg-white
                  px-4
                  py-3
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#EAF4FF]
                    text-[#0878F9]
                  "
                >
                  <ItemIcon size={22} />
                </div>

                <span
                  className="
                    text-[15px]
                    font-bold
                    text-[#0B1F3A]
                  "
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

const HowItWorks = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const timer = setTimeout(() => {
      scrollToHash(location.hash);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <main
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#F5FAFF]
        text-[#0B1F3A]
      "
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          w-full
          bg-[#F5FAFF]
        "
      >
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-7xl
            items-center
            gap-10
            px-5
            py-12
            sm:px-6
            md:py-14
            lg:grid-cols-2
            lg:gap-14
            lg:px-10
            xl:gap-20
          "
        >
          {/* LEFT */}
          <div className="min-w-0">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#D8E7F7]
                bg-white
                px-4
                py-2
                text-sm
                font-bold
                text-[#0878F9]
                shadow-[0_4px_16px_rgba(11,31,58,0.04)]
              "
            >
              <Box size={17} />
              <span>POD Fulfillment</span>
            </div>

            <h1
              className="
                mt-7
                max-w-[700px]
                text-[38px]
                font-extrabold
                leading-[1.04]
                tracking-[-0.035em]
                text-[#0A2A6B]
                sm:text-[46px]
                md:text-[52px]
                lg:text-[50px]
                xl:text-[56px]
              "
            >
              Turn your designs into
              <br className="hidden sm:block" />
              fulfilled products
            </h1>

            <p
              className="
                mt-6
                max-w-[680px]
                text-[17px]
                leading-8
                text-[#55708F]
                md:text-[18px]
              "
            >
              With a Print on Demand fulfillment workflow, products can move
              from your selected design and product setup toward production
              and delivery after an order is received.
            </p>

            {/* CHECKLIST */}
            <div className="mt-7 space-y-3">
              {[
                "Select your product",
                "Prepare your design",
                "Add the product to your store",
                "Receive a customer order",
                "Submit the order for fulfillment",
                "Product moves through production and shipping",
              ].map((item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-start
                    gap-3
                    text-[16px]
                    font-semibold
                    leading-7
                    text-[#0B1F3A]
                  "
                >
                  <CheckCircle2
                    className="
                      mt-[3px]
                      shrink-0
                      text-[#0878F9]
                    "
                    size={22}
                  />

                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <div className="mt-7">
              <Link
                to="/products"
                className="
                  inline-flex
                  min-h-[50px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#0878F9]
                  px-7
                  py-3
                  text-[15px]
                  font-bold
                  text-white
                  shadow-[0_10px_24px_rgba(8,120,249,0.20)]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#006CEB]
                "
              >
                Start Selling
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex w-full min-w-0 justify-center lg:justify-end">
            <div
              className="
                w-full
                max-w-[590px]
                rounded-[28px]
                border
                border-[#D9E7F5]
                bg-white
                p-4
                shadow-[0_18px_45px_rgba(11,31,58,0.08)]
                sm:p-5
              "
            >
              <FeatureVisual
                icon={Box}
                title="POD Fulfillment"
                description="Build your ecommerce journey with a structured workflow designed around products, stores, orders and fulfillment."
                items={[
                  {
                    label: "Products",
                    icon: Package,
                  },
                  {
                    label: "Store",
                    icon: Store,
                  },
                  {
                    label: "Orders",
                    icon: ClipboardCheck,
                  },
                  {
                    label: "Delivery",
                    icon: Truck,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK NAVIGATION
          
          IMPORTANT:
          No border
          No sticky
          No extra strip
      ===================================================== */}

      <section
        className="
          w-full
          bg-white
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[56px]
            w-full
            max-w-7xl
            items-center
            overflow-x-auto
            px-5
            py-2
            sm:px-6
            lg:px-10
          "
        >
          <nav className="flex min-w-max items-center gap-1">
            <SectionLink
              href="#print-on-demand"
              label="Print on Demand"
            />

            <SectionLink
              href="#dropshipping"
              label="Dropshipping"
            />

            <SectionLink
              href="#pod-fulfillment"
              label="POD Fulfillment"
            />

            <SectionLink
              href="#dropshipping-process"
              label="Dropshipping Process"
            />

            <SectionLink
              href="#bulk-printing"
              label="Bulk Printing"
            />

            <SectionLink
              href="#custom-branding"
              label="Custom Branding"
            />

            <SectionLink
              href="#start-clothing-brand"
              label="Start Clothing Brand"
            />
          </nav>
        </div>
      </section>

      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section
        className="
          w-full
          border-t
          border-[#DCE7F2]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-5
            py-16
            sm:px-6
            md:py-20
            lg:px-10
          "
        >
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.15em]
                text-[#0878F9]
              "
            >
              How It Works
            </p>

            <h2
              className="
                mt-3
                text-[34px]
                font-extrabold
                leading-tight
                tracking-[-0.03em]
                text-[#0A2A6B]
                sm:text-[42px]
              "
            >
              A simple workflow from idea to delivery
            </h2>

            <p
              className="
                mt-5
                text-[17px]
                leading-8
                text-[#55708F]
              "
            >
              Set up your products, connect your store, receive orders and let
              the fulfillment workflow handle the operational steps.
            </p>
          </div>

          <div
            className="
              mt-12
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {[
              {
                icon: Package,
                title: "Choose Products",
                text: "Select the products you want to sell.",
              },
              {
                icon: Palette,
                title: "Add Designs",
                text: "Prepare and apply your designs.",
              },
              {
                icon: Store,
                title: "Connect Store",
                text: "Add your products to your storefront.",
              },
              {
                icon: Truck,
                title: "Fulfill Orders",
                text: "Orders move toward production and delivery.",
              },
            ].map((step, index) => {
              const StepIcon = step.icon;

              return (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    border
                    border-[#DCE7F2]
                    bg-[#F8FBFF]
                    p-6
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#EAF4FF]
                      text-[#0878F9]
                    "
                  >
                    <StepIcon size={24} />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-lg
                      font-extrabold
                      text-[#0A2A6B]
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-[#55708F]
                    "
                  >
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRINT ON DEMAND
      ===================================================== */}

      <InfoSection
        id="print-on-demand"
        eyebrow="Print on Demand"
        title="Sell products without holding inventory"
        description="Create products around your designs and let the fulfillment workflow support production after customers place orders."
        points={[
          "No need to maintain large product inventory.",
          "Create products around your own designs.",
          "Orders can move into production after purchase.",
          "Focus more on your store and customer growth.",
        ]}
        buttonText="Explore Products"
        buttonHref="/products"
        icon={Package}
      >
        <FeatureVisual
          icon={Package}
          title="Print on Demand"
          description="Build a product catalog without making inventory the center of your business."
          items={[
            {
              label: "Product Setup",
              icon: Package,
            },
            {
              label: "Design",
              icon: Palette,
            },
            {
              label: "Orders",
              icon: ClipboardCheck,
            },
            {
              label: "Fulfillment",
              icon: Factory,
            },
          ]}
        />
      </InfoSection>

      {/* =====================================================
          DROPSHIPPING
      ===================================================== */}

      <InfoSection
        id="dropshipping"
        eyebrow="Dropshipping"
        title="Build a store without managing every operation yourself"
        description="Use a streamlined ecommerce workflow where your storefront and product setup stay connected to order processing and fulfillment."
        points={[
          "Choose products for your store.",
          "Set your own storefront and product presentation.",
          "Receive customer orders through your store.",
          "Move orders toward fulfillment without holding stock.",
        ]}
        buttonText="Start Dropshipping"
        buttonHref="/products"
        icon={ShoppingBag}
        reverse
      >
        <FeatureVisual
          icon={ShoppingBag}
          title="Dropshipping"
          description="A simple workflow for product selection, storefront setup and order fulfillment."
          items={[
            {
              label: "Catalog",
              icon: Package,
            },
            {
              label: "Store",
              icon: Store,
            },
            {
              label: "Customer",
              icon: Users,
            },
            {
              label: "Delivery",
              icon: Truck,
            },
          ]}
        />
      </InfoSection>

      {/* =====================================================
          POD FULFILLMENT
      ===================================================== */}

      <InfoSection
        id="pod-fulfillment"
        eyebrow="POD Fulfillment"
        title="Turn your designs into fulfilled products"
        description="With a Print on Demand fulfillment workflow, products can move from your selected design and product setup toward production and delivery after an order is received."
        points={[
          "Select your product",
          "Prepare your design",
          "Add the product to your store",
          "Receive a customer order",
          "Submit the order for fulfillment",
          "Product moves through production and shipping",
        ]}
        buttonText="Start Selling"
        buttonHref="/products"
        icon={Box}
      >
        <FeatureVisual
          icon={Box}
          title="POD Fulfillment"
          description="Build your ecommerce journey with a structured workflow designed around products, stores, orders and fulfillment."
          items={[
            {
              label: "Products",
              icon: Package,
            },
            {
              label: "Store",
              icon: Store,
            },
            {
              label: "Orders",
              icon: ClipboardCheck,
            },
            {
              label: "Delivery",
              icon: Truck,
            },
          ]}
        />
      </InfoSection>

      {/* =====================================================
          DROPSHIPPING PROCESS
      ===================================================== */}

      <InfoSection
        id="dropshipping-process"
        eyebrow="Dropshipping Process"
        title="From product selection to customer delivery"
        description="Keep your workflow simple by moving through a clear sequence of product selection, store setup, customer orders and fulfillment."
        points={[
          "Select products that fit your store.",
          "Prepare your product listings.",
          "Receive customer purchases.",
          "Process orders through fulfillment.",
          "Track the journey toward delivery.",
        ]}
        buttonText="View Products"
        buttonHref="/products"
        icon={ClipboardCheck}
        reverse
      >
        <FeatureVisual
          icon={ClipboardCheck}
          title="Order Workflow"
          description="Keep each important ecommerce step connected through one structured process."
          items={[
            {
              label: "Select",
              icon: Package,
            },
            {
              label: "Publish",
              icon: Globe2,
            },
            {
              label: "Order",
              icon: ClipboardCheck,
            },
            {
              label: "Ship",
              icon: Truck,
            },
          ]}
        />
      </InfoSection>

      {/* =====================================================
          BULK PRINTING
      ===================================================== */}

      <InfoSection
        id="bulk-printing"
        eyebrow="Bulk Printing"
        title="Print larger quantities for your business"
        description="For businesses that need multiple units, bulk printing can support larger product requirements with a structured production workflow."
        points={[
          "Prepare your product and design requirements.",
          "Plan quantities before production.",
          "Coordinate production around your business needs.",
          "Use printed products for larger campaigns or operations.",
        ]}
        buttonText="Explore Printing"
        buttonHref="/products"
        icon={Factory}
      >
        <FeatureVisual
          icon={Factory}
          title="Bulk Printing"
          description="A production-focused workflow for businesses requiring larger product quantities."
          items={[
            {
              label: "Quantity",
              icon: Package,
            },
            {
              label: "Production",
              icon: Factory,
            },
            {
              label: "Quality",
              icon: CheckCircle2,
            },
            {
              label: "Delivery",
              icon: Truck,
            },
          ]}
        />
      </InfoSection>

      {/* =====================================================
          CUSTOM BRANDING
      ===================================================== */}

      <InfoSection
        id="custom-branding"
        eyebrow="Custom Branding"
        title="Create products around your brand identity"
        description="Build a stronger brand presence by creating product experiences that are aligned with your own visual identity."
        points={[
          "Use your own branding direction.",
          "Create products around your brand identity.",
          "Build a consistent product experience.",
          "Grow a recognizable ecommerce presence.",
        ]}
        buttonText="Build Your Brand"
        buttonHref="/products"
        icon={Palette}
        reverse
      >
        <FeatureVisual
          icon={Palette}
          title="Custom Branding"
          description="Turn your brand identity into a consistent product experience."
          items={[
            {
              label: "Brand",
              icon: Building2,
            },
            {
              label: "Design",
              icon: Palette,
            },
            {
              label: "Products",
              icon: Package,
            },
            {
              label: "Store",
              icon: Store,
            },
          ]}
        />
      </InfoSection>

      {/* =====================================================
          START CLOTHING BRAND
      ===================================================== */}

      <InfoSection
        id="start-clothing-brand"
        eyebrow="Start a Clothing Brand"
        title="Build your clothing brand from the ground up"
        description="Bring your creative ideas into a structured clothing business workflow with products, designs, storefronts and fulfillment."
        points={[
          "Define your clothing brand direction.",
          "Choose products that match your audience.",
          "Create your product designs.",
          "Build your online storefront.",
          "Start selling and grow your catalog.",
        ]}
        buttonText="Start Your Brand"
        buttonHref="/products"
        icon={Rocket}
      >
        <FeatureVisual
          icon={Rocket}
          title="Clothing Brand"
          description="Move from your first product idea toward a complete ecommerce brand."
          items={[
            {
              label: "Concept",
              icon: Rocket,
            },
            {
              label: "Products",
              icon: Package,
            },
            {
              label: "Branding",
              icon: Palette,
            },
            {
              label: "Store",
              icon: Store,
            },
          ]}
        />
      </InfoSection>

      {/* =====================================================
          BENEFITS
      ===================================================== */}

      <section
        className="
          w-full
          border-t
          border-[#DCE7F2]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-5
            py-16
            sm:px-6
            md:py-20
            lg:px-10
          "
        >
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.15em]
                text-[#0878F9]
              "
            >
              Why Karodrop
            </p>

            <h2
              className="
                mt-3
                text-[34px]
                font-extrabold
                tracking-[-0.03em]
                text-[#0A2A6B]
                sm:text-[42px]
              "
            >
              Built to simplify your ecommerce journey
            </h2>
          </div>

          <div
            className="
              mt-12
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {[
              {
                icon: Clock3,
                title: "Save Time",
                text: "Spend more time growing your store.",
              },
              {
                icon: Package,
                title: "Product Variety",
                text: "Build your catalog around products you want to sell.",
              },
              {
                icon: Factory,
                title: "Fulfillment",
                text: "Keep production and order processing structured.",
              },
              {
                icon: Rocket,
                title: "Scale",
                text: "Build a workflow that can grow with your business.",
              },
            ].map((item, index) => {
              const BenefitIcon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    border
                    border-[#DCE7F2]
                    bg-[#F8FBFF]
                    p-6
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#EAF4FF]
                      text-[#0878F9]
                    "
                  >
                    <BenefitIcon size={24} />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-lg
                      font-extrabold
                      text-[#0A2A6B]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-[#55708F]
                    "
                  >
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section
        className="
          w-full
          border-t
          border-[#DCE7F2]
          bg-[#F5FAFF]
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-4xl
            px-5
            py-16
            sm:px-6
            md:py-20
          "
        >
          <div className="text-center">
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.15em]
                text-[#0878F9]
              "
            >
              FAQ
            </p>

            <h2
              className="
                mt-3
                text-[34px]
                font-extrabold
                tracking-[-0.03em]
                text-[#0A2A6B]
                sm:text-[42px]
              "
            >
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {[
              {
                q: "What is Print on Demand?",
                a: "Print on Demand is a workflow where products can be produced after an order is received rather than requiring large quantities of inventory upfront.",
              },
              {
                q: "Can I use my own designs?",
                a: "Yes. The workflow is designed around products that can be prepared using your own creative direction and designs.",
              },
              {
                q: "How does fulfillment work?",
                a: "After an order is received, the order can move through the fulfillment workflow toward production and delivery.",
              },
              {
                q: "Can I build my own clothing brand?",
                a: "Yes. You can build a product catalog around your brand identity and develop your online storefront.",
              },
            ].map((item, index) => (
              <details
                key={index}
                className="
                  group
                  rounded-2xl
                  border
                  border-[#DCE7F2]
                  bg-white
                  px-5
                  py-4
                  shadow-[0_4px_16px_rgba(11,31,58,0.03)]
                "
              >
                <summary
                  className="
                    flex
                    cursor-pointer
                    list-none
                    items-center
                    justify-between
                    gap-4
                    font-bold
                    text-[#0B1F3A]
                  "
                >
                  <span>{item.q}</span>

                  <ChevronDown
                    size={20}
                    className="
                      shrink-0
                      transition-transform
                      group-open:rotate-180
                    "
                  />
                </summary>

                <p
                  className="
                    mt-4
                    pr-8
                    text-[15px]
                    leading-7
                    text-[#55708F]
                  "
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section
        className="
          w-full
          border-t
          border-[#DCE7F2]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-5
            py-16
            sm:px-6
            md:py-20
            lg:px-10
          "
        >
          <div
            className="
              overflow-hidden
              rounded-[30px]
              bg-[#0A2A6B]
              px-6
              py-12
              text-center
              shadow-[0_20px_50px_rgba(10,42,107,0.15)]
              sm:px-10
              md:py-14
            "
          >
            <h2
              className="
                text-[32px]
                font-extrabold
                tracking-[-0.03em]
                text-white
                sm:text-[42px]
              "
            >
              Ready to start selling?
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-2xl
                text-[16px]
                leading-7
                text-[#D8E7F7]
              "
            >
              Choose your products, prepare your designs and start building
              your ecommerce journey.
            </p>

            <div className="mt-7">
              <Link
                to="/products"
                className="
                  inline-flex
                  min-h-[50px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-7
                  py-3
                  text-[15px]
                  font-bold
                  text-[#0A2A6B]
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#F5FAFF]
                "
              >
                Explore Products
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HowItWorks;
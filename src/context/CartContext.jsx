import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_PREFIX = "karodrop-cart-";

/* =========================================================
   CURRENT USER
========================================================= */

const getCurrentUser = () => {
  try {
    const raw =
      localStorage.getItem("karodrop-user") ||
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser");

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/* =========================================================
   USER-SPECIFIC CART KEY
========================================================= */

const getUserKey = () => {
  const user = getCurrentUser();

  return (
    user?._id ||
    user?.id ||
    user?.userId ||
    user?.email ||
    user?.username ||
    "guest"
  );
};

const getCartStorageKey = () => {
  return `${CART_STORAGE_PREFIX}${String(getUserKey()).toLowerCase()}`;
};

/* =========================================================
   READ / SAVE CART
========================================================= */

const readCart = () => {
  try {
    const raw = localStorage.getItem(getCartStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(
      getCartStorageKey(),
      JSON.stringify(items)
    );
  } catch (error) {
    console.error("Unable to save cart:", error);
  }
};

/* =========================================================
   CONFIGURATION KEY
   Used to identify same product configuration
========================================================= */

const createConfigurationKey = (configuration = {}) => {
  return JSON.stringify({
    brandId: configuration.brandId || "",
    productId: configuration.productId || "",
    color: configuration.color || "",
    size: configuration.size || "",
    designId: configuration.designId || "",
    designName: configuration.designName || "",
    designImage: configuration.designImage || "",
    printingPosition:
      configuration.printingPosition || "",
    printingMethod:
      configuration.printingMethod || "",
    printingOptions:
      configuration.printingOptions || [],
  });
};

/* =========================================================
   CART PROVIDER
========================================================= */

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(readCart);

  /* -------------------------------------------------------
     Reload cart when provider starts
  ------------------------------------------------------- */

  useEffect(() => {
    setCartItems(readCart());
  }, []);

  /* -------------------------------------------------------
     Save cart whenever cart changes
  ------------------------------------------------------- */

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  /* -------------------------------------------------------
     Listen for user/cart changes
  ------------------------------------------------------- */

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === getCartStorageKey()) {
        setCartItems(readCart());
      }
    };

    const handleUserChanged = () => {
      setCartItems(readCart());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(
      "userChanged",
      handleUserChanged
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "userChanged",
        handleUserChanged
      );
    };
  }, []);

  /* =======================================================
     ADD ITEM
  ======================================================= */

  const addItem = (
    product,
    qty = 1,
    configuration = {}
  ) => {
    const quantity = Math.max(
      1,
      Number(qty) || 1
    );

    const configurationKey =
      configuration.configurationKey ||
      createConfigurationKey(configuration);

    setCartItems((currentItems) => {
      const existingIndex =
        currentItems.findIndex(
          (item) =>
            item.configurationKey ===
            configurationKey
        );

      /* ---------------------------------------------------
         SAME CONFIGURATION ALREADY EXISTS
      --------------------------------------------------- */

      if (existingIndex !== -1) {
        const updated = [...currentItems];

        const existingItem =
          updated[existingIndex];

        const newQuantity =
          Number(
            existingItem.qty ||
              existingItem.quantity ||
              0
          ) + quantity;

        updated[existingIndex] = {
          ...existingItem,

          qty: newQuantity,
          quantity: newQuantity,

          updatedAt:
            new Date().toISOString(),
        };

        return updated;
      }

      /* ---------------------------------------------------
         CREATE NEW CART ITEM
      --------------------------------------------------- */

      const unitPrice = Number(
        configuration.unitPrice ??
          configuration.price ??
          product?.price ??
          0
      );

      const cartItem = {
        /* Cart ID */

        cartItemId: `cart-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`,

        /* -------------------------------------------------
           PRODUCT INFORMATION
        ------------------------------------------------- */

        _id:
          product?._id ||
          product?.id ||
          configuration.productId ||
          "",

        productId:
          configuration.productId ||
          product?._id ||
          product?.id ||
          "",

        title:
          product?.title ||
          product?.name ||
          configuration.productName ||
          "Product",

        productName:
          configuration.productName ||
          product?.title ||
          product?.name ||
          "Product",

        slug:
          product?.slug ||
          configuration.slug ||
          "",

        category:
          configuration.category ||
          product?.category ||
          product?.categoryName ||
          "",

        image:
          configuration.image ||
          product?.image ||
          product?.images?.[0] ||
          "",

        /* -------------------------------------------------
           PRICE
        ------------------------------------------------- */

        price: unitPrice,

        unitPrice,

        /* -------------------------------------------------
           QUANTITY
        ------------------------------------------------- */

        qty: quantity,

        quantity,

        /* -------------------------------------------------
           BRAND
        ------------------------------------------------- */

        brandId:
          configuration.brandId || "",

        brandName:
          configuration.brandName || "",

        brandLogo:
          configuration.brandLogo || "",

        /* -------------------------------------------------
           PRODUCT CONFIGURATION
        ------------------------------------------------- */

        color:
          configuration.color || "",

        size:
          configuration.size || "",

        /* -------------------------------------------------
           DESIGN
        ------------------------------------------------- */

        designType:
          configuration.designType || "",

        designId:
          configuration.designId || "",

        designName:
          configuration.designName || "",

        designFileName:
          configuration.designFileName || "",

        designImage:
          configuration.designImage || "",

        /* -------------------------------------------------
           PRINTING
        ------------------------------------------------- */

        printingPosition:
          configuration.printingPosition || "",

        printingMethod:
          configuration.printingMethod || "",

        printingOptions:
          Array.isArray(
            configuration.printingOptions
          )
            ? configuration.printingOptions
            : [],

        /* -------------------------------------------------
           CUSTOMER REQUIREMENTS
        ------------------------------------------------- */

        notes:
          configuration.notes || "",

        customerNotes:
          configuration.customerNotes ||
          configuration.notes ||
          "",

        /* -------------------------------------------------
           DELIVERY / PRODUCTION
        ------------------------------------------------- */

        productionTime:
          configuration.productionTime || "",

        deliveryTime:
          configuration.deliveryTime || "",

        /* -------------------------------------------------
           CONFIGURATION IDENTIFIER
        ------------------------------------------------- */

        configurationKey,

        /* -------------------------------------------------
           TIMESTAMPS
        ------------------------------------------------- */

        addedAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      };

      return [
        ...currentItems,
        cartItem,
      ];
    });
  };

  /* =======================================================
     UPDATE QUANTITY
  ======================================================= */

  const updateQty = (id, qty) => {
    const quantity = Math.max(
      1,
      Number(qty) || 1
    );

    setCartItems((items) =>
      items.map((item) => {
        const itemId =
          item.cartItemId || item._id;

        if (itemId !== id) {
          return item;
        }

        return {
          ...item,

          qty: quantity,

          quantity,

          updatedAt:
            new Date().toISOString(),
        };
      })
    );
  };

  /* =======================================================
     UPDATE CART ITEM
  ======================================================= */

  const updateItem = (
    id,
    updates = {}
  ) => {
    setCartItems((items) =>
      items.map((item) => {
        const itemId =
          item.cartItemId || item._id;

        if (itemId !== id) {
          return item;
        }

        const updatedItem = {
          ...item,
          ...updates,

          updatedAt:
            new Date().toISOString(),
        };

        /* -----------------------------------------------
           If configuration changes,
           regenerate configuration key
        ----------------------------------------------- */

        const shouldUpdateConfigurationKey =
          [
            "brandId",
            "productId",
            "color",
            "size",
            "designId",
            "designName",
            "designImage",
            "printingPosition",
            "printingMethod",
            "printingOptions",
          ].some((key) =>
            Object.prototype.hasOwnProperty.call(
              updates,
              key
            )
          );

        if (
          shouldUpdateConfigurationKey
        ) {
          updatedItem.configurationKey =
            createConfigurationKey(
              updatedItem
            );
        }

        /* -----------------------------------------------
           Keep qty and quantity synchronized
        ----------------------------------------------- */

        if (
          Object.prototype.hasOwnProperty.call(
            updates,
            "qty"
          )
        ) {
          const quantity = Math.max(
            1,
            Number(updates.qty) || 1
          );

          updatedItem.qty = quantity;
          updatedItem.quantity =
            quantity;
        }

        if (
          Object.prototype.hasOwnProperty.call(
            updates,
            "quantity"
          )
        ) {
          const quantity = Math.max(
            1,
            Number(updates.quantity) || 1
          );

          updatedItem.qty = quantity;
          updatedItem.quantity =
            quantity;
        }

        /* -----------------------------------------------
           Keep price fields synchronized
        ----------------------------------------------- */

        if (
          Object.prototype.hasOwnProperty.call(
            updates,
            "unitPrice"
          )
        ) {
          const price = Number(
            updates.unitPrice || 0
          );

          updatedItem.unitPrice =
            price;

          updatedItem.price = price;
        }

        if (
          Object.prototype.hasOwnProperty.call(
            updates,
            "price"
          ) &&
          !Object.prototype.hasOwnProperty.call(
            updates,
            "unitPrice"
          )
        ) {
          const price = Number(
            updates.price || 0
          );

          updatedItem.price = price;
          updatedItem.unitPrice =
            price;
        }

        return updatedItem;
      })
    );
  };

  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  const removeItem = (id) => {
    setCartItems((items) =>
      items.filter((item) => {
        const itemId =
          item.cartItemId || item._id;

        return itemId !== id;
      })
    );
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    setCartItems([]);
  };

  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(
          item.qty ||
            item.quantity ||
            0
        ),
      0
    );
  }, [cartItems]);

  /* =======================================================
     SUBTOTAL
  ======================================================= */

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        const price = Number(
          item.unitPrice ??
            item.price ??
            0
        );

        const quantity = Number(
          item.qty ??
            item.quantity ??
            0
        );

        return (
          total +
          price * quantity
        );
      },
      0
    );
  }, [cartItems]);

  /* =======================================================
     SHIPPING
     
     Currently free.
     Checkout can calculate actual shipping later.
  ======================================================= */

  const shipping = useMemo(() => {
    return 0;
  }, []);

  /* =======================================================
     TAX / GST
     
     Currently 0 because final GST calculation
     will be handled during checkout/backend.
  ======================================================= */

  const tax = useMemo(() => {
    return 0;
  }, []);

  /* =======================================================
     TOTAL
  ======================================================= */

  const total = useMemo(() => {
    return (
      subtotal +
      shipping +
      tax
    );
  }, [
    subtotal,
    shipping,
    tax,
  ]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {
    /* Cart */

    cartItems,

    items: cartItems,

    /* Actions */

    addItem,

    updateQty,

    updateItem,

    removeItem,

    clearCart,

    /* Counts */

    cartCount,

    count: cartCount,

    /* Pricing */

    subtotal,

    shipping,

    tax,

    total,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
};

/* =========================================================
   USE CART
========================================================= */

export const useCart = () => {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};

export default CartContext;
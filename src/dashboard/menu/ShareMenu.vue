<template>
  <div>
    <div class="flex items-center space-x-8">
      <font-awesome-icon
        icon="share-from-square"
        @click="togglePopup"
        class="text-xl hover:text-gray-700 text-gray-400 cursor-pointer"
      />
    </div>

    <div
      v-if="isPopupOpen"
      class="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 relative"
      >
        <h3
          class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-left"
        >
          Share Menu Link
          <font-awesome-icon
            icon="xmark"
            @click="togglePopup"
            class="text-2xl hover:text-red-600 text-black cursor-pointer absolute top-0 right-0 mt-6 mr-4 border-2 border-black px-2 py-1 rounded-md hover:border-red-600"
          />
        </h3>

        <ul class="list-none p-0 space-y-4">
          <li
            v-for="(link, index) in links"
            :key="index"
            class="flex flex-col justify-start items-start"
          >
            <div class="relative w-full">
              <BaseInput
                :value="link"
                type="text"
                class="truncate text-gray-600 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 pr-10"
                readonly
              />
              <font-awesome-icon
                icon="copy"
                @click="copyLink(link)"
                class="absolute  right-3 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-blue-500 text-2xl mt-6"
              />
            </div>

            <div class="flex flex-wrap w-full gap-3 mt-2">
              <BaseButton
                @click="navigateToLink(link)"
                label="Open Link"
                intent="default"
                class="w-full sm:w-auto flex-1 rounded-sm"
              />
            </div>

            <BaseButton
              @click="generateQRCode(link)"
              label="Generate QR Code"
              intent="inverse"
              class="w-full rounded-sm mt-2"
            />

            <!-- QR Code -->
            <div
              v-if="qrCodeUrl"
              class="flex flex-col items-center justify-center mt-4 w-full"
            >
              <div class="flex justify-center">
                <img :src="qrCodeUrl" alt="QR Code" class="w-40 h-40" />
              </div>

              <!-- QR Code Buttons -->
              <div class="flex flex-wrap justify-center w-full gap-3 mt-2">
                <BaseButton
                  @click="copyQRCode"
                  label="Copy QR Code"
                  intent="inverse"
                  class="w-full sm:w-auto flex-1 rounded-sm text-center"
                />
                <BaseButton
                  @click="downloadQRCode"
                  label="Download QR Code"
                  intent="inverse"
                  class="w-full sm:w-auto flex-1 rounded-sm text-center"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import QRCode from "qrcode-generator";
import { supabase } from "@/supabase";

const props = defineProps({
  menu: Object,
});

const isPopupOpen = ref(false);
const links = ref([]);
const qrCodeUrl = ref(null);

const togglePopup = async () => {
  isPopupOpen.value = !isPopupOpen.value;

  if (!isPopupOpen.value) {
    qrCodeUrl.value = null;
    return;
  }

  if (props.menu?.id) {
    const shortId = props.menu.id.substring(0, 6);
    links.value = [`http://localhost:5173/m/${shortId}`];

    // Save shortId to database
    await saveShortId(props.menu.id);
  } else {
    console.error("Menu ID is missing!");
  }
};

const saveShortId = async (menuId) => {
  if (!menuId) {
    console.error("Menu ID is missing!");
    return;
  }

  const shortId = menuId.substring(0, 6);

  const { data: existingUrl, error: checkError } = await supabase
    .from("url")
    .select("shortId")
    .eq("menu_id", menuId)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking existing shortId:", checkError);
    return;
  }

  if (!existingUrl) {
    const { error: insertError } = await supabase
      .from("url")
      .insert([{ shortId, menu_id: menuId }]);

    if (insertError) {
      console.error("Error inserting shortId:", insertError);
      return;
    }
  }
};

const copyLink = (link) => {
  navigator.clipboard
    .writeText(link)
    .then(() => {
      alert("Link copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};

const navigateToLink = (link) => {
  window.open(link, "_blank");
};

const generateQRCode = (link) => {
  const qr = QRCode(0, "L");
  qr.addData(link);
  qr.make();
  qrCodeUrl.value = qr.createDataURL();
};

const downloadQRCode = () => {
  if (!qrCodeUrl.value) return;

  const link = document.createElement("a");
  link.href = qrCodeUrl.value;
  link.download = "menu_qr_code.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const copyQRCode = async () => {
  if (!qrCodeUrl.value) {
    console.error("No QR code available to copy!");
    return;
  }

  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = qrCodeUrl.value;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Failed to convert QR code to blob.");
          return;
        }

        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
        alert("QR Code copied to clipboard!");
      }, "image/png");
    };
  } catch (err) {
    console.error("Failed to copy QR Code: ", err);
    alert("Failed to copy QR Code!");
  }
};
</script>

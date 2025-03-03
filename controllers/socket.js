const { getIO } = require("../utility/socket")

const mainSocket = async () => {
  try {
    const io = getIO()

    io.on("checkSocket", () => {
      console.log("Check Connection")
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  mainSocket,
}

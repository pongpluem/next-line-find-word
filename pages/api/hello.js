// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var i = 1
export default function handler(req, res) {
  i = i+1
  console.log(i)
  res.status(200).json({ name: 'John Doe' })
}

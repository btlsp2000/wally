<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WallyCAD | Calling Card</title>
    <style>
        /* --- THE DRAFTING TABLE --- */
        body {
            background-color: #121212;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: 'Courier New', Courier, monospace;
        }

        /* --- THE PHYSICAL CARD (3.5 x 2 Aspect Ratio) --- */
        .calling-card {
            width: 420px;
            height: 240px;
            background-color: #1a1a1a;
            border: 2px solid #4CAF50; /* CAD Green Border */
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.5);
        }

        /* --- TOP LEVEL: COMMS --- */
        .top-row {
            font-size: 14px;
            color: #d4d4d4;
            letter-spacing: 1px;
        }

        /* --- MIDDLE LEVEL: THE BRIDGE --- */
        .middle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px dashed #333; /* Structural reference line */
            padding-bottom: 10px;
        }

        .url {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
        }

        /* Placeholder for where the actual QR graphic will go */
        .qr-box {
            width: 60px;
            height: 60px;
            border: 1px solid #4CAF50;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #888;
            font-size: 10px;
            text-align: center;
        }

        /* --- BOTTOM LEVEL: THE ANCHOR --- */
        .bottom-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        /* Placeholder for the Wally Icon */
        .logo-box {
            width: 100px;
            height: 100px;
            border: 1px solid #4CAF50;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #888;
            font-size: 10px;
            text-align: center;
        }

        .architect-block {
            text-align: right;
        }

        .name {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: #e0e0e0;
            letter-spacing: 2px;
        }

        .date-stamp {
            display: block;
            font-size: 12px;
            color: #555;
            margin-top: 5px;
        }
    </style>
</head>
<body>

    <div class="calling-card">
        
        <div class="top-row">
            bttsp2013@gmail.com
        </div>

        <div class="middle-row">
            <div class="url">wallycad.com</div>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://wallycad.com" alt="WallyCAD QR" style="width: 60px; height: 60px; border: 1px solid #4CAF50;">
        </div>

        <div class="bottom-row">
            <div class="logo-box">
    <img src="logo9.png" alt="WallyCAD Logo" style="max-width: 100%; max-height: 100%; display: block;">
</div>
            <div class="architect-block">
                <span class="name">BILL TONNESEN</span>
                <span class="date-stamp">2026.03.26</span>
            </div>
        </div>

    </div>

</body>
</html>

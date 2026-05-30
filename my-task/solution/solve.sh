#!/bin/bash
git apply << 'EOF'
diff --git a/src/engine/physics/GravitySystem.ts b/src/engine/physics/GravitySystem.ts
index bf697da..1cee1c2 100644
--- a/src/engine/physics/GravitySystem.ts
+++ b/src/engine/physics/GravitySystem.ts
@@ -43,9 +43,17 @@ export class GravitySystem {
         if (clockwise) {
             this.state.vector.x = -oldY;
             this.state.vector.y = oldX;
+            if (this.state.direction === 'DOWN') this.state.direction = 'LEFT';
+            else if (this.state.direction === 'LEFT') this.state.direction = 'UP';
+            else if (this.state.direction === 'UP') this.state.direction = 'RIGHT';
+            else if (this.state.direction === 'RIGHT') this.state.direction = 'DOWN';
         } else {
             this.state.vector.x = oldY;
             this.state.vector.y = -oldX;
+            if (this.state.direction === 'DOWN') this.state.direction = 'RIGHT';
+            else if (this.state.direction === 'RIGHT') this.state.direction = 'UP';
+            else if (this.state.direction === 'UP') this.state.direction = 'LEFT';
+            else if (this.state.direction === 'LEFT') this.state.direction = 'DOWN';
         }
     }
 
EOF
